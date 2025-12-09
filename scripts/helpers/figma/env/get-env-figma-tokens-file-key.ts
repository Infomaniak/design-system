import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvFigmaTokensFileKey(): string {
  return getEnvVariable('FIGMA_TOKENS_FILE_KEY');
}
