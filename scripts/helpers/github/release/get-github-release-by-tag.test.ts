import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGithubReleaseByTag } from './get-github-release-by-tag.ts';

const MOCK_RELEASE = {
  id: 1,
  tag_name: '@infomaniak-design-system/figma-plugin-icons@0.0.1',
  name: '@infomaniak-design-system/figma-plugin-icons@0.0.1',
  html_url: 'https://github.com/owner/repo/releases/tag/x',
  draft: false,
  prerelease: false,
};

describe('getGithubReleaseByTag', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the release when it exists, encoding the tag name in the path', async () => {
    const fetchMock = vi.fn(async (): Promise<Response> => {
      return new Response(JSON.stringify(MOCK_RELEASE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const release: unknown = await getGithubReleaseByTag({
      owner: 'owner',
      repository: 'repo',
      authToken: 'test-token',
      tagName: '@infomaniak-design-system/figma-plugin-icons@0.0.1',
    });

    expect(release).toEqual(MOCK_RELEASE);
    expect(fetchMock).toHaveBeenCalledOnce();

    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = call;
    expect(url).toBe(
      'https://api.github.com/repos/owner/repo/releases/tags/%40infomaniak-design-system%2Ffigma-plugin-icons%400.0.1',
    );
    expect(init.method).toBe('GET');
    expect(init.headers).toMatchObject({
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer test-token',
      'User-Agent': 'infomaniak-design-system-ci',
      'X-GitHub-Api-Version': '2022-11-28',
    });
  });

  it('returns null when no release exists for the tag', async () => {
    const fetchMock = vi.fn(async (): Promise<Response> => {
      return new Response('Not Found', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const release: unknown = await getGithubReleaseByTag({
      owner: 'owner',
      repository: 'repo',
      authToken: 'test-token',
      tagName: 'v1.0.0',
    });

    expect(release).toBeNull();
  });

  it('throws on unexpected API errors', async () => {
    const fetchMock = vi.fn(async (): Promise<Response> => {
      return new Response('boom', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      getGithubReleaseByTag({
        owner: 'owner',
        repository: 'repo',
        authToken: 'test-token',
        tagName: 'v1.0.0',
      }),
    ).rejects.toThrow('GitHub API GET /repos/owner/repo/releases/tags/v1.0.0 failed (500): boom');
  });
});
