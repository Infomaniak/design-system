import { getEnvVariable } from '../../../env/get-env-variable.ts';

export const CI_PULL_REQUEST_AUTH_TOKEN_MOBILE = 'CI_PULL_REQUEST_AUTH_TOKEN_MOBILE';

export function getEnvCiPullRequestAuthTokenMobile(): string {
  return getEnvVariable(CI_PULL_REQUEST_AUTH_TOKEN_MOBILE);
}
