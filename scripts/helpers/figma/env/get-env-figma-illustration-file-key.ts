import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_ILLUSTRATION_FILE_KEY = 'FIGMA_ILLUSTRATION_FILE_KEY';

export function getEnvFigmaIllustrationFileKey(): string {
  return getEnvVariable(ENV_FIGMA_ILLUSTRATION_FILE_KEY);
}
