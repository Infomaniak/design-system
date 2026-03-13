import type { GithubCiPullRequest } from '../github-ci-config/github-ci-config.ts';

export interface CreateGithubPullRequestOptions {
  readonly owner: string;
  readonly repository: string;
  readonly authToken: string;

  // PR details
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
  const response: Response = await fetch(
    `https://api.github.com/repos/${owner}/${repository}/pulls`,
    {
      method: 'POST',
      headers: [
        ['Accept', 'application/vnd.github+json'],
        ['Authorization', `Bearer ${authToken}`],
        ['X-GitHub-Api-Version', '2022-11-28'],
      ],
      body: JSON.stringify(details),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create pull request: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
