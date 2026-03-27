import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_WEBHOOK_PASSCODE = 'FIGMA_WEBHOOK_PASSCODE';

export function getEnvFigmaWebhookPasscode(): string {
  return getEnvVariable(ENV_FIGMA_WEBHOOK_PASSCODE);
}
