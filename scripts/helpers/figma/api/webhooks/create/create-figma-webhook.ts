import { removeUndefinedProperties } from '../../../../misc/object/remove-undefined-properties.ts';
import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../../fetch-figma-json-api.ts';
import type { FigmaWebhookV2EventType } from '../types/event/figma-webhook-v2-event.ts';
import type { FigmaWebhookV2Context } from '../types/figma-webhook-v2-context.ts';
import type { FigmaWebhookV2Status } from '../types/figma-webhook-v2-status.ts';
import type { FigmaWebhookV2 } from '../types/figma-webhook-v2.ts';

export interface CreateFigmaWebhookOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly event_type: FigmaWebhookV2EventType;
  readonly context: FigmaWebhookV2Context;
  readonly context_id: string;
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
  event_type,
  context,
  context_id,
  endpoint,
  passcode,
  status,
  description,
  ...options
}: CreateFigmaWebhookOptions): Promise<FigmaWebhookV2> {
  return fetchFigmaJsonApi<FigmaWebhookV2>({
    ...options,
    method: 'POST',
    path: `/v2/webhooks`,
    headers: [['Content-Type', 'application/json']],
    body: JSON.stringify(
      removeUndefinedProperties({
        event_type,
        context,
        context_id,
        endpoint,
        passcode,
        status,
        description,
      }),
    ),
  });
}
