import type { FigmaWebhookV2BaseEvent } from '../../base/figma-webhook-v2-base-event.ts';

export interface FigmaWebhookV2FileUpdateEvent extends FigmaWebhookV2BaseEvent<'FILE_UPDATE'> {
  readonly file_key: string;
  readonly file_name: string;
}
