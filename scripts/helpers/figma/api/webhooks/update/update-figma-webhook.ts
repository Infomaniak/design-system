import { removeUndefinedProperties } from '../../../../misc/object/remove-undefined-properties.ts';
import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../../fetch-figma-json-api.ts';
import type { FigmaWebhookV2EventType } from '../types/event/figma-webhook-v2-event.ts';
import type { FigmaWebhookV2Status } from '../types/figma-webhook-v2-status.ts';
import type { FigmaWebhookV2 } from '../types/figma-webhook-v2.ts';

export interface UpdateFigmaWebhookOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly webhook_id: string | number;
  readonly event_type?: FigmaWebhookV2EventType;
  readonly endpoint?: string;
  readonly passcode?: string;
  readonly status?: FigmaWebhookV2Status;
  readonly description?: string;
}

/**
 * Updates a figma webhook.
 *
 * `PUT /v2/webhooks/:webhook_id`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/webhooks-endpoints/#webhooks-v2-put-endpoint
 */
export async function updateFigmaWebhook({
  webhook_id,
  event_type,
  endpoint,
  passcode,
  status,
  description,
  ...options
}: UpdateFigmaWebhookOptions): Promise<FigmaWebhookV2> {
  return fetchFigmaJsonApi<FigmaWebhookV2>({
    ...options,
    method: 'PUT',
    path: `/v2/webhooks/${webhook_id}`,
    headers: [['Content-Type', 'application/json']],
    body: JSON.stringify(
      removeUndefinedProperties({
        event_type,
        endpoint,
        passcode,
        status,
        description,
      }),
    ),
  });
}
