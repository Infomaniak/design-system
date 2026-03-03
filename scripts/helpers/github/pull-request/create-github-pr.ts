export interface CreateGithubPROptions {
  readonly owner: string;
  readonly repo: string;
  readonly authToken: string;

  // PR details
  readonly title: string;
  readonly description: string;
  readonly head: string;
  readonly base: string;
}

/**
 * Creates a pull request on a GitHub repository using the GitHub REST API.
 *
 * @param options.owner - The owner of the repository (user or organization).
 * @param options.repo - The name of the repository.
 * @param options.authToken - A GitHub Personal Access Token (PAT) with `PR` scope.
 * @param options.title - The title of the pull request.
 * @param options.description - The body/description of the pull request.
 * @param options.head - The branch containing the changes.
 * @param options.base - The branch the PR should be merged into.
 * @returns The GitHub API response for the created pull request.
 */
export async function createGithubPR({
  owner,
  repo,
  authToken,
  ...details
}: CreateGithubPROptions): Promise<unknown> {
  // TODO: Define promise return type
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: [
      ['Accept', 'application/vnd.github+json'],
      ['Authorization', `Bearer ${authToken}`],
      ['X-GitHub-Api-Version', '2022-11-28'],
    ],
    body: JSON.stringify(details),
  });

  return response.json();
}
