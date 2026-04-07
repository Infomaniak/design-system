import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../../fetch-figma-json-api.ts';
import type { FigmaWebhookV2 } from '../types/figma-webhook-v2.ts';

export interface UpdateFigmaWebhookOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly webhook_id: string | number;
}

/**
 * Deletes a figma webhook.
 *
 * `DELETE /v2/webhooks/:webhook_id`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/webhooks-endpoints/#webhooks-v2-delete-endpoint
 */
export async function deleteFigmaWebhook({
  webhook_id,
  ...options
}: UpdateFigmaWebhookOptions): Promise<FigmaWebhookV2> {
  return fetchFigmaJsonApi<FigmaWebhookV2>({
    ...options,
    method: 'DELETE',
    path: `/v2/webhooks/${webhook_id}`,
  });
}
