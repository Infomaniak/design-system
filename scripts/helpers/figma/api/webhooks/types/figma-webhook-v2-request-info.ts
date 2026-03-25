export interface FigmaWebhookV2RequestInfo {
  readonly endpoint: string;
  readonly payload: unknown;
  readonly sent_at: string; // UTC ISO 8601
}
