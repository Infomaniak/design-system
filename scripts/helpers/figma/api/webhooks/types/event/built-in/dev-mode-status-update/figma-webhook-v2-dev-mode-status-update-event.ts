import type { FigmaWebhookV2BaseEvent } from '../../base/figma-webhook-v2-base-event.ts';

export interface FigmaWebhookV2DevModeStatusUpdateEvent extends FigmaWebhookV2BaseEvent<'DEV_MODE_STATUS_UPDATE'> {
  readonly file_key: string;
  readonly node_id: string;
  readonly status: 'NONE' | 'READY_FOR_DEV' | 'COMPLETED';
  readonly change_message: string;
  readonly related_links: readonly unknown[];
}
