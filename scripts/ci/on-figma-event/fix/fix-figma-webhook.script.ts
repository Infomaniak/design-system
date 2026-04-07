import { valid } from 'semver';
import type { FetchFigmaJsonApiForConsumerOptions } from '../../../helpers/figma/api/fetch-figma-json-api.ts';
import {
  getFigmaFileVersionHistory,
  type GetFigmaFileVersionHistoryResponse,
} from '../../../helpers/figma/api/version-history/get-figma-file-version-history.ts';
import type { FigmaFileVersion } from '../../../helpers/figma/api/version-history/types/figma-file-version.ts';
import {
  createFigmaWebhook,
  type CreateFigmaWebhookOptions,
} from '../../../helpers/figma/api/webhooks/create/create-figma-webhook.ts';
import {
  getFigmaWebhookRequests,
  type GetFigmaWebhookRequestsResponse,
} from '../../../helpers/figma/api/webhooks/get-requests/get-figma-webhook-requests.ts';
import {
  listFigmaWebhooks,
  type ListFigmaWebhooksResponse,
} from '../../../helpers/figma/api/webhooks/list/list-figma-webhooks.ts';
import type { FigmaWebhookV2FileVersionUpdateEvent } from '../../../helpers/figma/api/webhooks/types/event/built-in/file-version-update/figma-webhook-v2-file-version-update-event.ts';
import type { FigmaWebhookV2Request } from '../../../helpers/figma/api/webhooks/types/figma-webhook-v2-request.ts';
import type { FigmaWebhookV2 } from '../../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';
import { getEnvFigmaApiToken } from '../../../helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEndpoint } from '../../../helpers/figma/env/get-env-figma-webhook-endpoint.ts';
import { getEnvFigmaWebhookPasscode } from '../../../helpers/figma/env/get-env-figma-webhook-passcode.ts';
import { Logger } from '../../../helpers/log/logger.ts';
import { runScript } from '../../../helpers/misc/run-script/run-script.ts';

// NOTE: figma webhooks are currently highly bugged, and we can't safely rely on them. Use this script in when webhooks do not trigger.
// https://forum.figma.com/report-a-problem-6/file-version-update-not-triggered-46344
// https://forum.figma.com/ask-the-community-7/file-version-update-and-library-publish-webhook-not-triggered-15136
// https://forum.figma.com/ask-the-community-7/webhook-events-file-update-and-file-comment-not-working-15860

await runScript(
  'fix-figma-webhook',
  async (logger: Logger): Promise<void> => {
    const figmaApiToken: string = getEnvFigmaApiToken();
    const figmaWebhookEndpoint: string = getEnvFigmaWebhookEndpoint();
    const figmaWebhookPasscode: string = getEnvFigmaWebhookPasscode();

    await logger.asyncTask('icon-file', async (logger: Logger): Promise<void> => {
      const figmaIconFileKey: string = getEnvFigmaIconFileKey();

      const expectedWebhook: Omit<
        CreateFigmaWebhookOptions,
        keyof FetchFigmaJsonApiForConsumerOptions
      > = {
        event_type: 'FILE_VERSION_UPDATE',
        context: 'file',
        context_id: figmaIconFileKey,
        endpoint: figmaWebhookEndpoint,
        passcode: figmaWebhookPasscode,
      };

      const { webhooks: existingWebhooks }: ListFigmaWebhooksResponse = await logger.asyncTask(
        'list-webhooks',
        (): Promise<ListFigmaWebhooksResponse> => {
          return listFigmaWebhooks({
            token: figmaApiToken,
            context: 'file',
            context_id: figmaIconFileKey,
          });
        },
      );

      // DEBUG
      // logger.info('Existing webhooks:', JSON.stringify(existingWebhooks, null, 2));

      const webhookIndex: number = existingWebhooks.findIndex(
        ({ event_type, context, context_id, endpoint }: FigmaWebhookV2): boolean => {
          return (
            event_type === expectedWebhook.event_type &&
            context === expectedWebhook.context &&
            context_id === expectedWebhook.context_id &&
            endpoint === expectedWebhook.endpoint
          );
        },
      );

      if (webhookIndex === -1) {
        const webhook: FigmaWebhookV2 = await logger.asyncTask(
          'create-webhook',
          (): Promise<FigmaWebhookV2> => {
            return createFigmaWebhook({
              ...expectedWebhook,
              token: figmaApiToken,
            });
          },
        );

        logger.info('Webhook created with success:', JSON.stringify(webhook, null, 2));
      } else {
        logger.info('Figma webhook already exists.');

        const { versions } = await logger.asyncTask(
          'get-file-version-history',
          (): Promise<GetFigmaFileVersionHistoryResponse> => {
            return getFigmaFileVersionHistory({
              token: figmaApiToken,
              file_key: figmaIconFileKey,
            });
          },
        );

        const webhookId: string = existingWebhooks[webhookIndex].id;

        const { requests } = await logger.asyncTask(
          'get-webhook-requests',
          (): Promise<GetFigmaWebhookRequestsResponse> => {
            return getFigmaWebhookRequests({
              token: figmaApiToken,
              webhook_id: webhookId,
            });
          },
        );

        // DEBUG
        // console.log(JSON.stringify(versions, null, 2));
        // console.log(JSON.stringify(requests, null, 2));

        for (let i: number = 0; i < versions.length; i++) {
          const version: FigmaFileVersion = versions[i];

          if (valid(version.label) !== null) {
            if (
              !requests.some((request: FigmaWebhookV2Request): boolean => {
                return (
                  request.request_info.payload.event_type === expectedWebhook.event_type &&
                  (request.request_info.payload as FigmaWebhookV2FileVersionUpdateEvent)
                    .file_key === expectedWebhook.context_id &&
                  (request.request_info.payload as FigmaWebhookV2FileVersionUpdateEvent).label ===
                    version.label
                );
              })
            ) {
              // DEBUG
              // console.log(version);

              logger.warn('Figma webhook out-of-date.');

              await logger.asyncTask(
                'trigger-webhook (force)',
                (logger: Logger): Promise<unknown> => {
                  logger.info(`version: ${version.label}`);

                  return fetch(getEnvFigmaWebhookEndpoint(), {
                    method: 'POST',
                    headers: [['Content-Type', 'application/json']],
                    body: JSON.stringify({
                      event_type: 'FILE_VERSION_UPDATE',
                      webhook_id: Number(webhookId),
                      file_key: figmaIconFileKey,
                      file_name: 'Unknown',
                      created_at: new Date().toISOString(),
                      version_id: version.id,
                      label: version.label,
                      description: version.description,
                      passcode: figmaWebhookPasscode,
                      triggered_by: {
                        id: '123',
                        email: 'unknown',
                        handle: 'unknown',
                        img_url: 'unknown',
                      },
                      timestamp: new Date().toISOString(),
                    } satisfies FigmaWebhookV2FileVersionUpdateEvent),
                  });
                },
              );
            }
            // skip other versions
            break;
          }
        }

        logger.info('Figma webhook up-to-date.');
      }
    });
  },
  {
    skipKChatNotificationOnError: true,
  },
);
