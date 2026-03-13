import { getEnvVariable } from '../../../env/get-env-variable.ts';

export const CI_PULL_REQUEST_AUTH_TOKEN_DESIGN_SYSTEM = 'CI_PULL_REQUEST_AUTH_TOKEN_DESIGN_SYSTEM';

export function getEnvCiPullRequestAuthTokenDesignSystem(): string {
  return getEnvVariable(CI_PULL_REQUEST_AUTH_TOKEN_DESIGN_SYSTEM);
}
