import { getFigmaWebhookRequests } from '../../../../helpers/figma/api/webhooks/get-requests/get-figma-webhook-requests.ts';
import type { FigmaWebhookV2RequestInfoPayload } from '../../../../helpers/figma/api/webhooks/types/figma-webhook-v2-request-info.ts';
import type { FigmaWebhookV2Request } from '../../../../helpers/figma/api/webhooks/types/figma-webhook-v2-request.ts';

export interface GetMatchingFigmaWebhookRequestOptions {
  readonly figmaApiToken: string;
  readonly figmaWebhookId: string;
  readonly expectedWebhookRequestPayload: ExpectedFigmaWebhookRequestPayload;
}

export type ExpectedFigmaWebhookRequestPayload = Partial<FigmaWebhookV2RequestInfoPayload>;

/**
 * Returns a Figma webhook request (a past triggered figma webhook) that matches the expected payload, or undefined if no match is found.
 */
export async function getMatchingFigmaWebhookRequest({
  figmaApiToken,
  figmaWebhookId,
  expectedWebhookRequestPayload,
}: GetMatchingFigmaWebhookRequestOptions): Promise<FigmaWebhookV2Request | undefined> {
  const { requests } = await getFigmaWebhookRequests({
    token: figmaApiToken,
    webhook_id: figmaWebhookId,
  });

  // DEBUG
  // console.log(JSON.stringify(requests, null, 2));

  return requests.find((request: FigmaWebhookV2Request): boolean => {
    return Object.entries(expectedWebhookRequestPayload).every(([key, value]): boolean => {
      return Reflect.get(request.request_info.payload, key) === value;
    });
  });
}
