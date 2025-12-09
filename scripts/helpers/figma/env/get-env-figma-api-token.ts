import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvFigmaApiToken(): string {
  return getEnvVariable('FIGMA_API_TOKEN');
}
