import type { FigmaWebhookV2BaseEvent } from '../../base/figma-webhook-v2-base-event.ts';
import type { FigmaWebhookV2Event } from '../../figma-webhook-v2-event.ts';

export interface FigmaWebhookV2FileVersionUpdateEvent extends FigmaWebhookV2BaseEvent<'FILE_VERSION_UPDATE'> {
  readonly file_key: string;
  readonly file_name: string;
  readonly created_at: string; // UTC ISO 8601
  readonly version_id: string;
  readonly label: string;
  readonly description: string;
}

export function isFigmaWebhookV2FileVersionUpdateEvent(
  input: Pick<FigmaWebhookV2Event, 'event_type'>,
): input is FigmaWebhookV2FileVersionUpdateEvent {
  return input.event_type === 'FILE_VERSION_UPDATE';
}
