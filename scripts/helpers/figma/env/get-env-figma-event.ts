import { getJsonEnvVariable } from '../../env/types/get-json-env-variable.ts';
import type { FigmaWebhookV2Event } from '../api/webhooks/types/figma-webhook-v2-event.ts';

export const ENV_FIGMA_EVENT = 'FIGMA_EVENT';

export function getEnvFigmaEvent(): FigmaWebhookV2Event {
  return getJsonEnvVariable(ENV_FIGMA_EVENT);
}
