import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvNpmAuthToken(): string {
  return getEnvVariable('NPM_AUTH_TOKEN');
}
