import type { FigmaUser } from '../../../../users/types/figma-user.ts';

export interface FigmaWebhookV2BaseEvent<GType> {
  readonly event_type: GType;
  readonly passcode: string;
  readonly timestamp: string; // UTC ISO 8601
  readonly triggered_by: FigmaUser;
  readonly webhook_id: number;
}
