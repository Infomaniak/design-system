import type { FigmaWebhookV2BaseEvent } from '../../base/figma-webhook-v2-base-event.ts';

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
