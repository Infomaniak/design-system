import { loadOptionallyEnvFile } from '../../helpers/env/env-file/load-optionally-env-file.ts';
import type { FetchFigmaJsonApiForConsumerOptions } from '../../helpers/figma/api/fetch-figma-json-api.ts';
import {
  createFigmaWebhook,
  type CreateFigmaWebhookOptions,
} from '../../helpers/figma/api/webhooks/create-figma-webhook.ts';
import {
  listFigmaWebhooks,
  type ListFigmaWebhooksResponse,
} from '../../helpers/figma/api/webhooks/list-figma-webhooks.ts';
import type { FigmaWebhookV2 } from '../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';
import { getEnvFigmaApiToken } from '../../helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEndpoint } from '../../helpers/figma/env/get-env-figma-webhook-endpoint.ts';
import { getEnvFigmaWebhookPasscode } from '../../helpers/figma/env/get-env-figma-webhook-passcode.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export function createFigmaWebhookScript(): Promise<void> {
  return logger.asyncTask('create-figma-webhook.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

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

    const { webhooks: existingWebhooks }: ListFigmaWebhooksResponse = await listFigmaWebhooks({
      token: figmaApiToken,
      context: 'file',
      context_id: figmaIconFileKey,
    });

    if (
      existingWebhooks.some(
        ({ event_type, context, context_id, endpoint }: FigmaWebhookV2): boolean => {
          return (
            event_type === expectedWebhook.event_type &&
            context === expectedWebhook.context &&
            context_id === expectedWebhook.context_id &&
            endpoint === expectedWebhook.endpoint
          );
        },
      )
    ) {
      logger.info('SKIP (non-blocking): Figma webhook already exists.');
      return;
    }

    const webhook: FigmaWebhookV2 = await createFigmaWebhook({
      ...expectedWebhook,
      token: figmaApiToken,
    });

    logger.info('Webhook create with success:', JSON.stringify(webhook, null, 2));

    // {
    //   id: '4124285',
    //     team_id: '',
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
  });
}

try {
  await createFigmaWebhookScript();
} catch (error: unknown) {
  logger.fatal(error);
}
