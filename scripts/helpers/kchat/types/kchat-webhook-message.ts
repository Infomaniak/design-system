export interface KchatWebhookMessage {
  readonly id: string;
  readonly create_at: number;
  readonly update_at: number;
  readonly delete_at: number;
  readonly user_id: string;
  readonly channel_id: string;
  readonly root_id: string;
  readonly original_id: string;
  readonly participants: null;
  readonly message: string;
  readonly type: string;
  readonly props: KchatWebhookMessageProps;
  readonly hashtags: null;
  readonly metadata: KchatWebhookMessageMetadata;
  readonly file_ids: null;
  readonly has_reactions: boolean;
  readonly edit_at: number;
  readonly is_pinned: boolean;
  readonly remote_id: null;
  readonly reply_count: number;
  readonly pending_post_id: null;
  readonly mentions: readonly string[];
  readonly is_following: boolean;
}

export interface KchatWebhookMessageMetadata {
  readonly embeds: readonly {
    readonly type: string;
  }[];
  readonly files: readonly unknown[];
  readonly reactions: readonly unknown[];
  readonly emojis: readonly KchatWebhookMessageEmoji[];
}

export interface KchatWebhookMessageEmoji {
  readonly id: string;
  readonly team_id: string;
  readonly update_at: number;
  readonly create_at: number;
  readonly delete_at: number;
  readonly creator_id: string;
  readonly name: string;
}

export interface KchatWebhookMessageProps {
  readonly override_username: string;
  readonly override_icon_url: string;
  readonly override_icon_emoji: null;
  readonly webhook_display_name: string;
  readonly attachments: readonly unknown[];
  readonly card: null;
  readonly from_webhook: string;
}
