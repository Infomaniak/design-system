import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvFigmaToken(): string {
  return getEnvVariable('FIGMA_API_TOKEN');
}
