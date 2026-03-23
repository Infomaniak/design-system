import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_EVENT = 'FIGMA_EVENT';

export function getEnvFigmaEvent(): string {
  return getEnvVariable(ENV_FIGMA_EVENT);
}
