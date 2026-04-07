import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_CI_DS_UPDATE_AND_PR_AUTH_TOKEN = 'CI_DS_UPDATE_AND_PR_AUTH_TOKEN';

export function getEnvCiDsUpdateAndPrAuthToken(): string {
  return getEnvVariable(ENV_CI_DS_UPDATE_AND_PR_AUTH_TOKEN);
}
