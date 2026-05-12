import { getEnvVariable } from '../../env/get-env-variable.ts';

/**
 * @deprecated
 * TODO remove
 */
export function getEnvNpmAuthToken(): string {
  return getEnvVariable('NPM_AUTH_TOKEN');
}
