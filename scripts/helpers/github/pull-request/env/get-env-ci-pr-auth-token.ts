import { getEnvVariable } from '../../../env/get-env-variable.ts';

export const CI_PR_AUTH_TOKEN = 'CI_PR_AUTH_TOKEN';

export function getEnvCiPrAuthToken(): string {
  return getEnvVariable(CI_PR_AUTH_TOKEN);
}
