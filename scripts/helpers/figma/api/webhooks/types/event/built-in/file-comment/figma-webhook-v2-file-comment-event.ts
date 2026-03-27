import type { FigmaUser } from '../../../../../users/types/figma-user.ts';
import type { FigmaWebhookV2BaseEvent } from '../../base/figma-webhook-v2-base-event.ts';

export interface FigmaWebhookV2FileCommentEvent extends FigmaWebhookV2BaseEvent<'FILE_COMMENT'> {
  readonly file_key: string;
  readonly file_name: string;
  readonly description: string;
  readonly comment: readonly unknown[];
  readonly comment_id: number;
  readonly mentions: readonly FigmaUser[];
  readonly order_id: number;
  readonly parent_id: number;
  readonly created_at: string; // UTC ISO 8601
  readonly resolved_at: string; // UTC ISO 8601
}
