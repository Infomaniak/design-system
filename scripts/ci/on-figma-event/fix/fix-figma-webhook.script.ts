import type { FetchFigmaJsonApiForConsumerOptions } from '../../../helpers/figma/api/fetch-figma-json-api.ts';
import type { FigmaFileVersion } from '../../../helpers/figma/api/version-history/types/figma-file-version.ts';
import {
  createFigmaWebhook,
  type CreateFigmaWebhookOptions,
} from '../../../helpers/figma/api/webhooks/create/create-figma-webhook.ts';
import { deleteFigmaWebhook } from '../../../helpers/figma/api/webhooks/delete/delete-figma-webhook.ts';
import {
  listFigmaWebhooks,
  type ListFigmaWebhooksResponse,
} from '../../../helpers/figma/api/webhooks/list/list-figma-webhooks.ts';
import type { FigmaWebhookV2Request } from '../../../helpers/figma/api/webhooks/types/figma-webhook-v2-request.ts';
import type { FigmaWebhookV2 } from '../../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';
import { getEnvFigmaApiToken } from '../../../helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEndpoint } from '../../../helpers/figma/env/get-env-figma-webhook-endpoint.ts';
import { getEnvFigmaWebhookPasscode } from '../../../helpers/figma/env/get-env-figma-webhook-passcode.ts';
import { Logger } from '../../../helpers/log/logger.ts';
import { runScript } from '../../../helpers/misc/run-script/run-script.ts';
import { sleep } from '../../../helpers/misc/sleep.ts';
import { emitFakeFigmaFileVersionUpdateWebhookEvent } from './steps/emit-fake-figma-file-version-update-webhook-event.ts';
import { getLastFigmaFileVersion } from './steps/get-last-figma-file-version.ts';
import {
  type ExpectedFigmaWebhookRequestPayload,
  getMatchingFigmaWebhookRequest,
} from './steps/get-matching-figma-webhook-request.ts';

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
        await fixFileVersionUpdateWebhookTrigger({
          figmaApiToken,
          figmaFileKey: figmaIconFileKey,
          figmaWebhookId: existingWebhooks[webhookIndex].id,
          figmaWebhookEndpoint,
          figmaWebhookPasscode,
          logger,
        });
      }
    });
  },
  {
    skipKChatNotificationOnError: true,
  },
);

/*---*/

interface FixFileVersionUpdateWebhookTriggerOptions {
  readonly figmaApiToken: string;
  readonly figmaFileKey: string;
  readonly figmaWebhookId: string;
  readonly figmaWebhookEndpoint: string;
  readonly figmaWebhookPasscode: string;
  readonly logger: Logger;
}

function fixFileVersionUpdateWebhookTrigger({
  figmaApiToken,
  figmaFileKey,
  figmaWebhookId,
  figmaWebhookEndpoint,
  figmaWebhookPasscode,
  logger,
}: FixFileVersionUpdateWebhookTriggerOptions): Promise<void> {
  return logger.asyncTask(
    'fix-file-version-update-webhook-trigger',
    async (logger: Logger): Promise<void> => {
      const version: FigmaFileVersion | undefined = await getLastFigmaFileVersion({
        figmaApiToken,
        figmaFileKey,
      });

      // DEBUG
      // console.log(version);

      if (version === undefined) {
        logger.info('Figma webhook up-to-date: no version found.');
      } else {
        const expectedWebhookRequestPayload: ExpectedFigmaWebhookRequestPayload = {
          event_type: 'FILE_VERSION_UPDATE',
          file_key: figmaFileKey,
          label: version.label!,
        };

        const matchingRequest: FigmaWebhookV2Request | undefined =
          await getMatchingFigmaWebhookRequest({
            figmaApiToken,
            figmaWebhookId: figmaWebhookId,
            expectedWebhookRequestPayload,
          });

        // DEBUG
        console.log(matchingRequest);

        if (matchingRequest === undefined) {
          logger.warn('Figma webhook out-of-date.');
          logger.info('Initiating "trigger" fix...');

          await logger.asyncTask('delete-webhook', () => {
            return deleteFigmaWebhook({
              token: figmaApiToken,
              webhook_id: figmaWebhookId,
            });
          });

          const webhook: FigmaWebhookV2 = await logger.asyncTask(
            'recreate-webhook',
            (): Promise<FigmaWebhookV2> => {
              return createFigmaWebhook({
                token: figmaApiToken,
                event_type: 'FILE_VERSION_UPDATE',
                context: 'file',
                context_id: figmaFileKey,
                endpoint: figmaWebhookEndpoint,
                passcode: figmaWebhookPasscode,
              });
            },
          );

          const newFigmaWebhookId: string = webhook.id;

          await logger.asyncTask('await-auto-trigger', (): Promise<void> => {
            return sleep(5000);
          });

          const newMatchingRequest: FigmaWebhookV2Request | undefined =
            await getMatchingFigmaWebhookRequest({
              figmaApiToken,
              figmaWebhookId: newFigmaWebhookId,
              expectedWebhookRequestPayload,
            });

          if (newMatchingRequest === undefined) {
            logger.warn('Failed to trigger Figma webhook using deletion + creation trick.');

            await logger.asyncTask(
              'trigger-webhook (force)',
              (logger: Logger): Promise<unknown> => {
                logger.info(`version: ${version.label}`);

                return emitFakeFigmaFileVersionUpdateWebhookEvent({
                  figmaFileKey,
                  figmaWebhookId,
                  figmaWebhookEndpoint,
                  figmaWebhookPasscode,
                  version,
                });
              },
            );

            logger.info('Figma webhook triggered (force) with success !');
          } else {
            logger.info('Figma webhook triggered with success !');
          }
        } else {
          logger.info('Figma webhook up-to-date: found existing event.');
        }
      }
    },
  );
}
