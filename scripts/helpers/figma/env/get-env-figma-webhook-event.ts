import { getJsonEnvVariable } from '../../env/types/get-json-env-variable.ts';
import type { FigmaWebhookV2Event } from '../api/webhooks/types/event/figma-webhook-v2-event.ts';

export const ENV_FIGMA_WEBHOOK_EVENT = 'FIGMA_WEBHOOK_EVENT';

export function getEnvFigmaWebhookEvent(): FigmaWebhookV2Event {
  return getJsonEnvVariable(ENV_FIGMA_WEBHOOK_EVENT);
}
