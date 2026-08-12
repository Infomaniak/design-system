export interface GithubRequestOptions {
  readonly method: 'GET' | 'POST' | 'PATCH';
  readonly path: string;
  readonly token: string;
  readonly body?: unknown;
}

export async function githubRequest<TResponse>({
  method,
  path,
  token,
  body,
}: GithubRequestOptions): Promise<TResponse> {
  const response: Response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'infomaniak-design-system-ci',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const text: string = await response.text();
    throw new Error(`GitHub API ${method} ${path} failed (${response.status}): ${text}`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
