import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../../fetch-figma-json-api.ts';
import type { FigmaWebhookV2Request } from '../types/figma-webhook-v2-request.ts';

export interface GetFigmaWebhookRequestsOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly webhook_id: string | number;
}

export interface GetFigmaWebhookRequestsResponse {
  readonly requests: readonly FigmaWebhookV2Request[];
}

/**
 * Get figma webhook requests.
 *
 * `GET /v2/webhooks/:webhook_id/requests`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/webhooks-endpoints/#webhooks-v2-requests-endpoint
 */
export async function getFigmaWebhookRequests({
  webhook_id,
  ...options
}: GetFigmaWebhookRequestsOptions): Promise<GetFigmaWebhookRequestsResponse> {
  return fetchFigmaJsonApi<GetFigmaWebhookRequestsResponse>({
    ...options,
    path: `/v2/webhooks/${webhook_id}/requests`,
  });
}
