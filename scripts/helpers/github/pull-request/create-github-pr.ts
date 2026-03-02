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
