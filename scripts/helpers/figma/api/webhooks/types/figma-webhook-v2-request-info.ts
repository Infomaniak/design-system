import type { FigmaWebhookV2Event } from './event/figma-webhook-v2-event.ts';

export interface FigmaWebhookV2RequestInfo {
  readonly endpoint: string;
  readonly payload: FigmaWebhookV2RequestInfoPayload;
  readonly sent_at: string; // UTC ISO 8601
}

export type FigmaWebhookV2RequestInfoPayload = FigmaWebhookV2Event & {
  readonly retries: number;
  readonly protocol_version: string;
};
