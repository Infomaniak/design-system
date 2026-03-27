import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_API_TOKEN = 'FIGMA_API_TOKEN';

export function getEnvFigmaApiToken(): string {
  return getEnvVariable(ENV_FIGMA_API_TOKEN);
}
