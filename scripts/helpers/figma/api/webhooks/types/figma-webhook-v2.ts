import type { FigmaWebhookV2EventType } from './event/figma-webhook-v2-event.ts';
import type { FigmaWebhookV2Context } from './figma-webhook-v2-context.ts';
import type { FigmaWebhookV2Status } from './figma-webhook-v2-status.ts';

export interface FigmaWebhookV2 {
  readonly id: string;
  readonly event_type: FigmaWebhookV2EventType;
  readonly context: FigmaWebhookV2Context;
  readonly context_id: string;
  readonly team_id: string;
  readonly plan_api_id: string;
  readonly status: FigmaWebhookV2Status;
  readonly client_id: string | null;
  readonly passcode: string;
  readonly endpoint: string;
  readonly description: string;
}
