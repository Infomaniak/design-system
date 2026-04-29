import { createFigmaWebhook } from '../../../../helpers/figma/api/webhooks/create/create-figma-webhook.ts';
import type { FigmaWebhookV2 } from '../../../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';

export interface CreateFigmaFileVersionUpdateWebhookOptions {
  readonly figmaApiToken: string;
  readonly figmaFileKey: string;
  readonly figmaWebhookEndpoint: string;
  readonly figmaWebhookPasscode: string;
}

export async function createFigmaFileVersionUpdateWebhook({
  figmaApiToken,
  figmaFileKey,
  figmaWebhookEndpoint,
  figmaWebhookPasscode,
}: CreateFigmaFileVersionUpdateWebhookOptions): Promise<FigmaWebhookV2> {
  return createFigmaWebhook({
    token: figmaApiToken,
    event_type: 'FILE_VERSION_UPDATE',
    context: 'file',
    context_id: figmaFileKey,
    endpoint: figmaWebhookEndpoint,
    passcode: figmaWebhookPasscode,
  });
}
