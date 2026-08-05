import { afterEach, describe, expect, it, vi } from 'vitest';
import type { GithubCiPullRequest } from '../github-ci-config/github-ci-config.ts';
import { createGithubPullRequest } from './create-github-pull-request.ts';

const MOCK_PR = {
  number: 1,
  title: 'Test PR',
  body: 'PR body',
  state: 'open',
  draft: false,
  html_url: 'https://github.com/owner/repo/pull/1',
} as unknown as GithubCiPullRequest;

describe('createGithubPullRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a pull request and returns the parsed response', async () => {
    const fetchMock = vi.fn(async (): Promise<Response> => {
      return new Response(JSON.stringify(MOCK_PR), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await createGithubPullRequest({
      owner: 'owner',
      repository: 'repo',
      authToken: 'test-token',
      title: 'Test PR',
      body: 'PR body',
      head: 'feat-branch',
      base: 'develop',
    });

    expect(result).toEqual(MOCK_PR);
    expect(fetchMock).toHaveBeenCalledOnce();

    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = call;
    expect(url).toBe('https://api.github.com/repos/owner/repo/pulls');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
      'User-Agent': 'infomaniak-design-system-ci',
      'X-GitHub-Api-Version': '2022-11-28',
    });
    expect(init.body).toBe(
      JSON.stringify({
        title: 'Test PR',
        body: 'PR body',
        head: 'feat-branch',
        base: 'develop',
      }),
    );
  });

  it('throws when the GitHub API responds with an error status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response('{"message": "Validation Failed"}', {
          status: 422,
          statusText: 'Unprocessable Entity',
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );

    await expect(
      createGithubPullRequest({
        owner: 'owner',
        repository: 'repo',
        authToken: 'test-token',
        title: 'Test PR',
        body: 'PR body',
        head: 'feat-branch',
        base: 'develop',
      }),
    ).rejects.toThrow('GitHub API POST /repos/owner/repo/pulls failed (422)');
  });
});
