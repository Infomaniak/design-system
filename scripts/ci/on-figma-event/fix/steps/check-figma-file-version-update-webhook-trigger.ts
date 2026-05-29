import { getLastFigmaFileVersion } from '../../../../helpers/figma/api/version-history/helpers/get-last-figma-file-version.ts';
import type { FigmaFileVersion } from '../../../../helpers/figma/api/version-history/types/figma-file-version.ts';
import { Logger } from '../../../../helpers/log/logger.ts';
import { fixFileVersionUpdateWebhookTrigger } from './fix-file-version-update-webhook-trigger.ts';

export interface CheckFigmaFileVersionUpdateWebhookTriggerOptions {
  readonly figmaApiToken: string;
  readonly figmaFileKey: string;
  readonly figmaWebhookId: string;
  readonly figmaWebhookEndpoint: string;
  readonly figmaWebhookPasscode: string;
  readonly logger: Logger;
}

export async function checkFigmaFileVersionUpdateWebhookTrigger({
  figmaApiToken,
  figmaFileKey,
  figmaWebhookId,
  figmaWebhookEndpoint,
  figmaWebhookPasscode,
  logger,
}: CheckFigmaFileVersionUpdateWebhookTriggerOptions): Promise<void> {
  const version: FigmaFileVersion | undefined = await getLastFigmaFileVersion({
    figmaApiToken,
    figmaFileKey,
  });

  if (version === undefined) {
    logger.info('Figma webhook up-to-date: no version found.');
  } else {
    logger.info(`Last version found: ${version.label}`);

    await fixFileVersionUpdateWebhookTrigger({
      figmaApiToken,
      figmaFileKey,
      figmaWebhookId,
      version,
      figmaWebhookEndpoint,
      figmaWebhookPasscode,
      logger,
      strategy: 'recreate',
    });
  }
}
