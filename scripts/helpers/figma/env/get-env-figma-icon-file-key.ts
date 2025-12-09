import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvFigmaIconFileKey(): string {
  return getEnvVariable('FIGMA_ICON_FILE_KEY');
}
