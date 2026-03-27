import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_WEBHOOK_ENDPOINT = 'FIGMA_WEBHOOK_ENDPOINT';

export function getEnvFigmaWebhookEndpoint(): string {
  return getEnvVariable(ENV_FIGMA_WEBHOOK_ENDPOINT);
}
