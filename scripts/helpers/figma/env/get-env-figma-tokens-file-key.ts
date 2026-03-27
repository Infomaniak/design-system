import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_TOKENS_FILE_KEY = 'FIGMA_TOKENS_FILE_KEY';

export function getEnvFigmaTokensFileKey(): string {
  return getEnvVariable(ENV_FIGMA_TOKENS_FILE_KEY);
}
