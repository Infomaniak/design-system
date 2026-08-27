import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_FIGMA_ICON_OUTLINE_FILE_KEY = 'FIGMA_ICON_OUTLINE_FILE_KEY';

export function getEnvFigmaIconOutlineFileKey(): string {
  return getEnvVariable(ENV_FIGMA_ICON_OUTLINE_FILE_KEY);
}
