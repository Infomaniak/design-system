import type { FigmaFileVersion } from '../../../../helpers/figma/api/version-history/types/figma-file-version.ts';
import type { FigmaWebhookV2FileVersionUpdateEvent } from '../../../../helpers/figma/api/webhooks/types/event/built-in/file-version-update/figma-webhook-v2-file-version-update-event.ts';

export interface EmitFakeFigmaFileVersionUpdateWebhookEventOptions {
  readonly figmaFileKey: string;
  readonly figmaWebhookId: string;
  readonly figmaWebhookEndpoint: string;
  readonly figmaWebhookPasscode: string;
  readonly version: Pick<FigmaFileVersion, 'id' | 'label' | 'description'>;
}

/**
 * Emits a "fake" Figma file version update webhook event.
 */
export async function emitFakeFigmaFileVersionUpdateWebhookEvent({
  figmaFileKey,
  figmaWebhookId,
  figmaWebhookEndpoint,
  figmaWebhookPasscode,
  version,
}: EmitFakeFigmaFileVersionUpdateWebhookEventOptions) {
  return fetch(figmaWebhookEndpoint, {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    body: JSON.stringify({
      event_type: 'FILE_VERSION_UPDATE',
      webhook_id: Number(figmaWebhookId),
      file_key: figmaFileKey,
      file_name: 'Unknown',
      created_at: new Date().toISOString(),
      version_id: version.id,
      label: version.label!,
      description: version.description ?? '',
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
}
