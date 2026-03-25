import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_CI_UPDATE_DESIGN_SYSTEM_REPO_AND_CREATE_PULL_REQUEST_AUTH_TOKEN =
  'CI_DS_UPDATE_AND_PR_AUTH_TOKEN';

export function getEnvCiUpdateDesignSystemRepoAndCreatePullRequestAuthToken(): string {
  return getEnvVariable(ENV_CI_UPDATE_DESIGN_SYSTEM_REPO_AND_CREATE_PULL_REQUEST_AUTH_TOKEN);
}
