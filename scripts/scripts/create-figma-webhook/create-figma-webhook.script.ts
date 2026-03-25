import type { FetchFigmaJsonApiForConsumerOptions } from '../../helpers/figma/api/fetch-figma-json-api.ts';
import {
  createFigmaWebhook,
  type CreateFigmaWebhookOptions,
} from '../../helpers/figma/api/webhooks/create/create-figma-webhook.ts';
import {
  listFigmaWebhooks,
  type ListFigmaWebhooksResponse,
} from '../../helpers/figma/api/webhooks/list/list-figma-webhooks.ts';
import type { FigmaWebhookV2 } from '../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';
import { getEnvFigmaApiToken } from '../../helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEndpoint } from '../../helpers/figma/env/get-env-figma-webhook-endpoint.ts';
import { getEnvFigmaWebhookPasscode } from '../../helpers/figma/env/get-env-figma-webhook-passcode.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { runScript } from '../../helpers/misc/run-script/run-script.ts';

/**
 * Helpful doc: https://medium.com/@nour_99023/an-automation-journey-with-figma-webhooks-f4df82be21b3
 */

await runScript(
  'create-figma-webhook',
  async (logger: Logger): Promise<void> => {
    const figmaApiToken: string = getEnvFigmaApiToken();
    const figmaWebhookEndpoint: string = getEnvFigmaWebhookEndpoint();
    const figmaWebhookPasscode: string = getEnvFigmaWebhookPasscode();
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

    logger.info('Existing webhooks:', JSON.stringify(existingWebhooks, null, 2));

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

    if (webhookIndex !== -1) {
      logger.info('SKIP (non-blocking): Figma webhook already exists.');

      return;
    }

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

    // INFO: Example of webhook response:
    // {
    //   id: '4124285',
    //   team_id: '',
    //   event_type: 'FILE_VERSION_UPDATE',
    //   client_id: null,
    //   endpoint: 'https://api.infomaniak.com/1/callback/figma/design-system',
    //   passcode: '',
    //   status: 'ACTIVE',
    //   description: null,
    //   protocol_version: '2',
    //   context_id: 'fjSRAikJq01Dof4iXazaPL',
    //   context: 'file',
    //   plan_api_id: 'team-997049337419759198'
    // }
  },
  {
    skipKChatNotificationOnError: true,
  },
);
