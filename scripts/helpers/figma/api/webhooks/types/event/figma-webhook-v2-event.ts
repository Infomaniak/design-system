import type { FigmaWebhookV2DevModeStatusUpdateEvent } from './built-in/dev-mode-status-update/figma-webhook-v2-dev-mode-status-update-event.ts';
import type { FigmaWebhookV2FileCommentEvent } from './built-in/file-comment/figma-webhook-v2-file-comment-event.ts';
import type { FigmaWebhookV2FileDeleteEvent } from './built-in/file-delete/figma-webhook-v2-file-delete-event.ts';
import type { FigmaWebhookV2FileUpdateEvent } from './built-in/file-update/figma-webhook-v2-file-update-event.ts';
import type { FigmaWebhookV2FileVersionUpdateEvent } from './built-in/file-version-update/figma-webhook-v2-file-version-update-event.ts';
import type { FigmaWebhookV2LibraryPublishEvent } from './built-in/library-publish/figma-webhook-v2-library-publish-event.ts';
import type { FigmaWebhookV2PingEvent } from './built-in/ping/figma-webhook-v2-ping-event.ts';

export type FigmaWebhookV2Event =
  | FigmaWebhookV2PingEvent
  | FigmaWebhookV2FileUpdateEvent
  | FigmaWebhookV2FileDeleteEvent
  | FigmaWebhookV2FileVersionUpdateEvent
  | FigmaWebhookV2LibraryPublishEvent
  | FigmaWebhookV2FileCommentEvent
  | FigmaWebhookV2DevModeStatusUpdateEvent;

export type FigmaWebhookV2EventType = FigmaWebhookV2Event['event_type'];
