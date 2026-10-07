import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GithubRelease } from '../api/types.ts';
import { createGithubRelease } from './create-github-release.ts';

const MOCK_RELEASE_ID = 42;

function createMockRelease(overrides: Partial<GithubRelease> = {}): GithubRelease {
  return {
    id: MOCK_RELEASE_ID,
    tag_name: 'v1.0.0',
    name: 'v1.0.0',
    html_url: 'https://github.com/owner/repo/releases/42',
    draft: false,
    prerelease: false,
    ...overrides,
  };
}

function stubFetch(handler: (url: string, method: string) => Response): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      return handler(String(input), init?.method ?? 'GET');
    },
  );
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

function createJsonResponse(release: GithubRelease, status: number): Response {
  return new Response(JSON.stringify(release), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('createGithubRelease', () => {
  let assetsDirectory: string;

  beforeEach(async () => {
    assetsDirectory = await mkdtemp(join(tmpdir(), 'create-github-release-test-'));
    await writeFile(join(assetsDirectory, 'asset.txt'), 'data');
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    await rm(assetsDirectory, { recursive: true, force: true });
  });

  it('returns the existing release untouched when skipIfExists is enabled and it already exists', async () => {
    const fetchMock = stubFetch((): Response => {
      return createJsonResponse(createMockRelease(), 200);
    });

    const release: unknown = await createGithubRelease({
      owner: 'owner',
      repository: 'repo',
      authToken: 'test-token',
      tagName: 'v1.0.0',
      name: 'v1.0.0',
      assetsDirectory,
      skipIfExists: true,
    });

    expect(release).toEqual(createMockRelease());
    expect(fetchMock).toHaveBeenCalledOnce();

    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = call;
    expect(url).toBe('https://api.github.com/repos/owner/repo/releases/tags/v1.0.0');
    expect(init.method).toBe('GET');
  });

  it('creates and publishes the release when it does not exist, even with skipIfExists enabled', async () => {
    const fetchMock = stubFetch((url: string, method: string): Response => {
      if (method === 'GET' && url.includes('/releases/tags/')) {
        return new Response('Not Found', { status: 404 });
      }

      if (method === 'POST' && url === 'https://api.github.com/repos/owner/repo/releases') {
        return createJsonResponse(createMockRelease({ draft: true }), 201);
      }

      if (
        method === 'POST' &&
        url.startsWith('https://uploads.github.com/repos/owner/repo/releases/42/assets?name=')
      ) {
        return new Response(
          JSON.stringify({
            id: 1,
            name: 'asset.txt',
            size: 4,
            browser_download_url: 'https://github.com/owner/repo/releases/download/x',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }

      if (
        method === 'PATCH' &&
        url === `https://api.github.com/repos/owner/repo/releases/${MOCK_RELEASE_ID}`
      ) {
        return createJsonResponse(createMockRelease(), 200);
      }

      throw new Error(`Unexpected request: ${method} ${url}`);
    });

    const release: unknown = await createGithubRelease({
      owner: 'owner',
      repository: 'repo',
      authToken: 'test-token',
      tagName: 'v1.0.0',
      name: 'v1.0.0',
      assetsDirectory,
      skipIfExists: true,
    });

    expect(release).toEqual(createMockRelease());
    expect(fetchMock).toHaveBeenCalledTimes(4);

    const [, createInit] = fetchMock.mock.calls[1] as unknown as [string, RequestInit];
    expect(JSON.parse(String(createInit.body))).toMatchObject({
      tag_name: 'v1.0.0',
      draft: true,
    });

    const [, publishInit] = fetchMock.mock.calls[3] as unknown as [string, RequestInit];
    expect(JSON.parse(String(publishInit.body))).toMatchObject({ draft: false });
  });

  it('does not check for an existing release when skipIfExists is disabled', async () => {
    const fetchMock = stubFetch((url: string, method: string): Response => {
      if (method === 'POST' && url === 'https://api.github.com/repos/owner/repo/releases') {
        return createJsonResponse(createMockRelease({ draft: true }), 201);
      }

      if (
        method === 'POST' &&
        url.startsWith('https://uploads.github.com/repos/owner/repo/releases/42/assets?name=')
      ) {
        return new Response(
          JSON.stringify({
            id: 1,
            name: 'asset.txt',
            size: 4,
            browser_download_url: 'https://github.com/owner/repo/releases/download/x',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }

      if (
        method === 'PATCH' &&
        url === `https://api.github.com/repos/owner/repo/releases/${MOCK_RELEASE_ID}`
      ) {
        return createJsonResponse(createMockRelease(), 200);
      }

      throw new Error(`Unexpected request: ${method} ${url}`);
    });

    await createGithubRelease({
      owner: 'owner',
      repository: 'repo',
      authToken: 'test-token',
      tagName: 'v1.0.0',
      name: 'v1.0.0',
      assetsDirectory,
    });

    const calls: readonly string[] = fetchMock.mock.calls.map((call: unknown[]): string => {
      const [requestUrl, requestInit] = call as [string, RequestInit];
      return `${requestInit?.method ?? 'GET'} ${String(requestUrl)}`;
    });

    expect(calls.every((call: string): boolean => !call.includes('/releases/tags/'))).toBe(true);
    expect(calls[0]).toBe('POST https://api.github.com/repos/owner/repo/releases');
  });
});
