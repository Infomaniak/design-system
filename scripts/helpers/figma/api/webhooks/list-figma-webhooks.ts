import { removeUndefinedProperties } from '../../../misc/object/remove-undefined-properties.ts';
import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../fetch-figma-json-api.ts';
import type { FigmaWebhookV2Context } from './types/figma-webhook-v2-context.ts';
import type { FigmaWebhookV2 } from './types/figma-webhook-v2.ts';

export interface ListFigmaWebhooksOptions extends FetchFigmaJsonApiForConsumerOptions {
  // using context
  readonly context?: FigmaWebhookV2Context;
  readonly contextId?: string;
  // using plan
  readonly planAPIid?: string;
  readonly nextPage?: string;
  readonly prevPage?: string;
}

export interface ListFigmaWebhooksResponse {
  readonly webhooks: FigmaWebhookV2[];
  readonly pagination: {
    readonly next_page?: string;
    readonly prev_page?: string;
  };
}

/**
 * List figma webhooks.
 *
 * `GET /v2/webhooks`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/webhooks-endpoints/#webhooks-v2-get-endpoint
 */
export async function listFigmaWebhooks({
  context,
  contextId,
  planAPIid,
  nextPage,
  prevPage,
  ...options
}: ListFigmaWebhooksOptions): Promise<ListFigmaWebhooksResponse> {
  return fetchFigmaJsonApi<ListFigmaWebhooksResponse>({
    ...options,
    path: `/v2/webhooks`,
    searchParam: new URLSearchParams(
      removeUndefinedProperties({
        context,
        context_id: contextId,
        plan_api_id: planAPIid,
        next_page: nextPage,
        prev_page: prevPage,
      }) as Record<string, string>,
    ),
  });
}
