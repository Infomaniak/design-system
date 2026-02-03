import { getEnvVariable } from '../../../env/get-env-variable.ts';

export interface GithubPullRequestDetails {
  readonly url: string;
  readonly title: string;
  readonly number: number;
  readonly body: string;
  readonly author: string;
}

export function getEnvGithubPullRequestDetails(): GithubPullRequestDetails {
  return JSON.parse(getEnvVariable('GITHUB_PULL_REQUEST_DETAILS'));
}
