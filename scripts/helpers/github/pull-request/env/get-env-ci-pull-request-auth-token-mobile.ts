import { getEnvVariable } from '../../../env/get-env-variable.ts';

export const ENV_CI_PULL_REQUEST_AUTH_TOKEN_MOBILE = 'CI_PULL_REQUEST_AUTH_TOKEN_MOBILE';

export function getEnvCiPullRequestAuthTokenMobile(): string {
  return getEnvVariable(ENV_CI_PULL_REQUEST_AUTH_TOKEN_MOBILE);
}
