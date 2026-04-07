import type { FigmaWebhookV2RequestInfo } from './figma-webhook-v2-request-info.ts';

export interface FigmaWebhookV2Request {
  readonly webhook_id: number;
  readonly request_info: FigmaWebhookV2RequestInfo;
  readonly response_info: 0 | null;
  readonly error_msg: string | null;
}
