import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_EVENT_PASSCODE = 'FIGMA_EVENT_PASSCODE';

export function getEnvFigmaEventPasscode(): string {
  return getEnvVariable(ENV_FIGMA_EVENT_PASSCODE);
}
