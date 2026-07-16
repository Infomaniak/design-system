import type { FigmaFileVersion } from '../../../../helpers/figma/api/version-history/types/figma-file-version.ts';
import type { FigmaWebhookV2Request } from '../../../../helpers/figma/api/webhooks/types/figma-webhook-v2-request.ts';
import type { FigmaWebhookV2 } from '../../../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';
import { Logger } from '../../../../helpers/log/logger.ts';
import { sleep } from '../../../../helpers/misc/async/sleep.ts';
import { emitFakeFigmaFileVersionUpdateWebhookEvent } from './emit-fake-figma-file-version-update-webhook-event.ts';
import { getMatchingFigmaWebhookRequest } from './get-matching-figma-webhook-request.ts';
import { recreateFigmaFileVersionUpdateWebhook } from './recreate-figma-file-version-update-webhook.ts';

export interface FixFileVersionUpdateWebhookTriggerOptions {
  readonly figmaApiToken: string;
  readonly figmaFileKey: string;
  readonly figmaWebhookId: string;
  readonly version: Pick<FigmaFileVersion, 'id' | 'label' | 'description'>;
  readonly figmaWebhookEndpoint: string;
  readonly figmaWebhookPasscode: string;
  readonly logger: Logger;
  readonly strategy?: 'recreate' | 'force-trigger';
}

export async function fixFileVersionUpdateWebhookTrigger({
  figmaApiToken,
  figmaFileKey,
  figmaWebhookId,
  version,
  figmaWebhookEndpoint,
  figmaWebhookPasscode,
  logger,
  strategy = 'recreate',
}: FixFileVersionUpdateWebhookTriggerOptions): Promise<void> {
  logger.info(`Fixing Figma webhook (strategy: ${JSON.stringify(strategy)}):`);

  const matchingRequest: FigmaWebhookV2Request | undefined = await getMatchingFigmaWebhookRequest({
    figmaApiToken,
    figmaWebhookId,
    expectedWebhookRequestPayload: {
      event_type: 'FILE_VERSION_UPDATE',
      file_key: figmaFileKey,
      label: version.label!,
    },
  });

  if (matchingRequest === undefined) {
    logger.warn('Figma webhook out-of-date.');

    logger.info(`Initiating trigger fix using ${JSON.stringify(strategy)} strategy.`);

    switch (strategy) {
      case 'recreate': {
        const webhook: FigmaWebhookV2 = await logger.asyncTask(
          'recreate-webhook',
          (): Promise<FigmaWebhookV2> => {
            return recreateFigmaFileVersionUpdateWebhook({
              figmaApiToken,
              figmaFileKey,
              figmaWebhookEndpoint,
              figmaWebhookPasscode,
              figmaWebhookId,
            });
          },
        );

        await logger.asyncTask('await-auto-trigger', (): Promise<void> => {
          return sleep(5000);
        });

        await fixFileVersionUpdateWebhookTrigger({
          figmaApiToken,
          figmaFileKey,
          figmaWebhookId: webhook.id,
          version,
          figmaWebhookEndpoint,
          figmaWebhookPasscode,
          logger,
          strategy: 'force-trigger',
        });
        break;
      }

      case 'force-trigger': {
        await logger.asyncTask('trigger-webhook (force)', (): Promise<unknown> => {
          return emitFakeFigmaFileVersionUpdateWebhookEvent({
            figmaFileKey,
            figmaWebhookId,
            figmaWebhookEndpoint,
            figmaWebhookPasscode,
            version,
          });
        });
        break;
      }
    }
  } else {
    // DEBUG
    // console.log(matchingRequest);

    logger.info('Figma webhook up-to-date.');
  }
}
