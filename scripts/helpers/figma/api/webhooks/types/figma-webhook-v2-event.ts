import type { FigmaUser } from '../../users/types/figma-user.ts';

export interface FigmaWebhookV2BaseEvent<GType> {
  readonly event_type: GType;
  readonly passcode: string;
  readonly timestamp: string; // UTC ISO 8601
  readonly triggered_by: FigmaUser;
  readonly webhook_id: number;
}

export type FigmaWebhookV2PingEvent = FigmaWebhookV2BaseEvent<'PING'>;

export interface FigmaWebhookV2FileUpdateEvent extends FigmaWebhookV2BaseEvent<'FILE_UPDATE'> {
  readonly file_key: string;
  readonly file_name: string;
}

export interface FigmaWebhookV2FileDeleteEvent extends FigmaWebhookV2BaseEvent<'FILE_DELETE'> {
  readonly file_key: string;
  readonly file_name: string;
}

export interface FigmaWebhookV2FileVersionUpdateEvent extends FigmaWebhookV2BaseEvent<'FILE_VERSION_UPDATE'> {
  readonly file_key: string;
  readonly file_name: string;
  readonly created_at: string; // UTC ISO 8601
  readonly version_id: string;
  readonly label: string;
  readonly description: string;
}

export interface FigmaWebhookV2LibraryPublishEvent extends FigmaWebhookV2BaseEvent<'LIBRARY_PUBLISH'> {
  readonly file_key: string;
  readonly file_name: string;
  readonly description: string;
  readonly created_components: readonly unknown[];
  readonly created_styles: readonly unknown[];
  readonly created_variables: readonly unknown[];
  readonly modified_components: readonly unknown[];
  readonly modified_styles: readonly unknown[];
  readonly modified_variables: readonly unknown[];
  readonly deleted_components: readonly unknown[];
  readonly deleted_styles: readonly unknown[];
  readonly deleted_variables: readonly unknown[];
}

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

export interface FigmaWebhookV2DevModeStatusUpdateEvent extends FigmaWebhookV2BaseEvent<'DEV_MODE_STATUS_UPDATE'> {
  readonly file_key: string;
  readonly node_id: string;
  readonly status: 'NONE' | 'READY_FOR_DEV' | 'COMPLETED';
  readonly change_message: string;
  readonly related_links: readonly unknown[];
}

export type FigmaWebhookV2Event =
  | FigmaWebhookV2PingEvent
  | FigmaWebhookV2FileUpdateEvent
  | FigmaWebhookV2FileDeleteEvent
  | FigmaWebhookV2FileVersionUpdateEvent
  | FigmaWebhookV2LibraryPublishEvent
  | FigmaWebhookV2FileCommentEvent
  | FigmaWebhookV2DevModeStatusUpdateEvent;

export type FigmaWebhookV2EventType = FigmaWebhookV2Event['event_type'];
