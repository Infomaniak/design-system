import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvFigmaIllustrationFileKey(): string {
  return getEnvVariable('FIGMA_ILLUSTRATION_FILEKEY');
}
