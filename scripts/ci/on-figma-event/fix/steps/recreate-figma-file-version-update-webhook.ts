import { deleteFigmaWebhook } from '../../../../helpers/figma/api/webhooks/delete/delete-figma-webhook.ts';
import type { FigmaWebhookV2 } from '../../../../helpers/figma/api/webhooks/types/figma-webhook-v2.ts';
import {
  createFigmaFileVersionUpdateWebhook,
  type CreateFigmaFileVersionUpdateWebhookOptions,
} from './create-figma-file-version-update-webhook.ts';

export interface RecreateFigmaFileVersionUpdateWebhookOptions extends CreateFigmaFileVersionUpdateWebhookOptions {
  readonly figmaWebhookId: string;
}

export async function recreateFigmaFileVersionUpdateWebhook({
  figmaApiToken,
  figmaWebhookId,
  ...options
}: RecreateFigmaFileVersionUpdateWebhookOptions): Promise<FigmaWebhookV2> {
  await deleteFigmaWebhook({
    token: figmaApiToken,
    webhook_id: figmaWebhookId,
  });

  return createFigmaFileVersionUpdateWebhook({
    figmaApiToken,
    ...options,
  });
}
