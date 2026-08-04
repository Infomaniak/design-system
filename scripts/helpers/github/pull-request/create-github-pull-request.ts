import { githubRequest } from '../api/github-request.ts';
import type { GithubCiPullRequest } from '../github-ci-config/github-ci-config.ts';

export interface CreateGithubPullRequestOptions {
  readonly owner: string;
  readonly repository: string;
  readonly authToken: string;
  readonly title: string;
  readonly body: string;
  readonly head: string;
  readonly base: string;
}

/**
 * Creates a pull request on a GitHub repository using the GitHub REST API.
 */
export async function createGithubPullRequest({
  owner,
  repository,
  authToken,
  ...details
}: CreateGithubPullRequestOptions): Promise<GithubCiPullRequest> {
  return githubRequest<GithubCiPullRequest>({
    method: 'POST',
    path: `/repos/${owner}/${repository}/pulls`,
    token: authToken,
    body: details,
  });
}
