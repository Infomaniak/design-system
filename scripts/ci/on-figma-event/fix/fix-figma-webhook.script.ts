import type { FetchFigmaJsonApiForConsumerOptions } from '../../../helpers/figma/api/fetch-figma-json-api.ts';
import {
  createFigmaWebhook,
  type CreateFigmaWebhookOptions,
} from '../../../helpers/figma/api/webhooks/create/create-figma-webhook.ts';
import {
  listFigmaWebhooks,
  type ListFigmaWebhooksResponse,
} from '../../../helpers/figma/api/webhooks/list/list-figma-webhooks.ts';
import type { FigmaWebhookV2 } from '../../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';
import { getEnvFigmaApiToken } from '../../../helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEndpoint } from '../../../helpers/figma/env/get-env-figma-webhook-endpoint.ts';
import { getEnvFigmaWebhookPasscode } from '../../../helpers/figma/env/get-env-figma-webhook-passcode.ts';
import { Logger } from '../../../helpers/log/logger.ts';
import { runScript } from '../../../helpers/misc/run-script/run-script.ts';
import { checkFigmaFileVersionUpdateWebhookTrigger } from './steps/check-figma-file-version-update-webhook-trigger.ts';

// NOTE: figma webhooks are currently highly bugged, and we can't safely rely on them. Use this script when webhooks do not trigger.
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
        await checkFigmaFileVersionUpdateWebhookTrigger({
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
    notifyError: false,
  },
);
