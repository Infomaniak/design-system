import { removeUndefinedProperties } from '../../../misc/object/remove-undefined-properties.ts';
import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../fetch-figma-json-api.ts';
import type { FigmaWebhookV2Context } from './types/figma-webhook-v2-context.ts';
import type { FigmaWebhookV2Event } from './types/figma-webhook-v2-event.ts';
import type { FigmaWebhookV2Status } from './types/figma-webhook-v2-status.ts';
import type { FigmaWebhookV2 } from './types/figma-webhook-v2.ts';

export interface CreateFigmaWebhookOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly eventType: FigmaWebhookV2Event;
  readonly context: FigmaWebhookV2Context;
  readonly contextId: string;
  readonly endpoint: string;
  readonly passcode: string;
  readonly status?: FigmaWebhookV2Status;
  readonly description?: string;
}

/**
 * Creates a figma webhook.
 *
 * `POST /v2/webhooks`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/webhooks-endpoints/#webhooks-v2-post-endpoint
 */
export async function createFigmaWebhook({
  eventType,
  context,
  contextId,
  endpoint,
  passcode,
  status,
  description,
  ...options
}: CreateFigmaWebhookOptions): Promise<FigmaWebhookV2> {
  const data: FigmaWebhookV2 = await fetchFigmaJsonApi<FigmaWebhookV2>({
    ...options,
    method: 'POST',
    path: `/v2/webhooks`,
    body: JSON.stringify(
      removeUndefinedProperties({
        event_type: eventType,
        context,
        context_id: contextId,
        endpoint,
        passcode,
        status,
        description,
      }),
    ),
  });

  return data;
}
