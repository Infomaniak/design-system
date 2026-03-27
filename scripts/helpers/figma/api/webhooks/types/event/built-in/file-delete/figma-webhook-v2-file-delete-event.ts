import type { FigmaWebhookV2BaseEvent } from '../../base/figma-webhook-v2-base-event.ts';

export interface FigmaWebhookV2FileDeleteEvent extends FigmaWebhookV2BaseEvent<'FILE_DELETE'> {
  readonly file_key: string;
  readonly file_name: string;
}
