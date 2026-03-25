import { removeUndefinedProperties } from '../../../../misc/object/remove-undefined-properties.ts';
import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../../fetch-figma-json-api.ts';
import type { FigmaPagination } from '../../shared/types/figma-pagination.ts';
import type { FigmaWebhookV2Context } from '../types/figma-webhook-v2-context.ts';
import type { FigmaWebhookV2 } from '../types/figma-webhook-v2.ts';

export interface ListFigmaWebhooksUsingContextOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly context: FigmaWebhookV2Context;
  readonly context_id: string;
}

export interface ListFigmaWebhooksUsingPlanOptions
  extends FetchFigmaJsonApiForConsumerOptions, FigmaPagination {
  readonly plan_api_id: string;
}

export type ListFigmaWebhooksOptions =
  | ListFigmaWebhooksUsingContextOptions
  | ListFigmaWebhooksUsingPlanOptions;

export interface ListFigmaWebhooksResponse {
  readonly webhooks: readonly FigmaWebhookV2[];
}

export interface ListFigmaWebhooksResponseWithPagination extends ListFigmaWebhooksResponse {
  readonly pagination: FigmaPagination;
}

/**
 * List figma webhooks.
 *
 * `GET /v2/webhooks`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/webhooks-endpoints/#webhooks-v2-get-endpoint
 */
export async function listFigmaWebhooks(
  options: ListFigmaWebhooksUsingContextOptions,
): Promise<ListFigmaWebhooksResponse>;
export async function listFigmaWebhooks(
  options: ListFigmaWebhooksUsingPlanOptions,
): Promise<ListFigmaWebhooksResponseWithPagination>;
export async function listFigmaWebhooks(
  options: ListFigmaWebhooksOptions,
): Promise<ListFigmaWebhooksResponse> {
  const { context, context_id, plan_api_id, next_page, prev_page, ...remaining } =
    options as ListFigmaWebhooksUsingContextOptions & ListFigmaWebhooksUsingPlanOptions;

  return fetchFigmaJsonApi<ListFigmaWebhooksResponse>({
    ...remaining,
    path: `/v2/webhooks`,
    searchParam: new URLSearchParams(
      removeUndefinedProperties({
        context,
        context_id,
        plan_api_id,
        next_page,
        prev_page,
      }) as Record<string, string>,
    ),
  });
}
