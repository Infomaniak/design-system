import { afterEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../../log/logger.ts';
import {
  deleteGithubObsoletePublishBranches,
  getPublishVersionChannel,
  type DeleteGithubObsoletePublishBranchesOptions,
} from './delete-github-obsolete-publish-branches.ts';

const OPTIONS: DeleteGithubObsoletePublishBranchesOptions = {
  owner: 'owner',
  repository: 'repo',
  authToken: 'test-token',
  branchPrefix: 'esds/tokens/',
  currentBranchName: 'esds/tokens/1.2.0-rc.300',
  logger: Logger.never(),
};

const EXISTING_BRANCHES: readonly string[] = [
  'esds/tokens/1.1.0-rc.100',
  'esds/tokens/1.2.0-rc.200',
  'esds/tokens/1.2.0-rc.300',
  'esds/tokens/1.2.0-dev.250',
  'esds/tokens/1.1.0',
];

function jsonResponse(body: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mockFetch(
  branches: readonly string[],
  failingDeletes: readonly string[] = [],
): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async (url: string, init: RequestInit): Promise<Response> => {
    if (init.method === 'GET') {
      return jsonResponse(branches.map((branch: string) => ({ ref: `refs/heads/${branch}` })));
    }

    if (failingDeletes.some((branch: string): boolean => url.endsWith(branch))) {
      return jsonResponse({ message: 'Forbidden' }, 403);
    }

    return new Response(null, { status: 204 });
  });

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

describe('getPublishVersionChannel', () => {
  it('returns the release channel of a version', () => {
    expect(getPublishVersionChannel('1.2.3')).toBe('prod');
    expect(getPublishVersionChannel('1.2.3-rc.123')).toBe('rc');
    expect(getPublishVersionChannel('1.2.3-dev.123')).toBe('dev');
  });
});

describe('deleteGithubObsoletePublishBranches', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('deletes the other branches of the same prefix and channel', async () => {
    const fetchMock = mockFetch(EXISTING_BRANCHES);

    await expect(deleteGithubObsoletePublishBranches(OPTIONS)).resolves.toEqual([
      'esds/tokens/1.1.0-rc.100',
      'esds/tokens/1.2.0-rc.200',
    ]);

    const calls = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(calls.map(([url, init]) => `${init.method} ${url}`)).toEqual([
      'GET https://api.github.com/repos/owner/repo/git/matching-refs/heads/esds/tokens/',
      'DELETE https://api.github.com/repos/owner/repo/git/refs/heads/esds/tokens/1.1.0-rc.100',
      'DELETE https://api.github.com/repos/owner/repo/git/refs/heads/esds/tokens/1.2.0-rc.200',
    ]);
    expect(calls[0][1].headers).toMatchObject({ Authorization: 'Bearer test-token' });
  });

  it('only deletes previous prod branches when publishing a prod version', async () => {
    mockFetch([...EXISTING_BRANCHES, 'esds/tokens/1.2.0']);

    await expect(
      deleteGithubObsoletePublishBranches({
        ...OPTIONS,
        currentBranchName: 'esds/tokens/1.2.0',
      }),
    ).resolves.toEqual(['esds/tokens/1.1.0']);
  });

  it('keeps going when a deletion fails', async () => {
    mockFetch(EXISTING_BRANCHES, ['esds/tokens/1.1.0-rc.100']);

    await expect(deleteGithubObsoletePublishBranches(OPTIONS)).resolves.toEqual([
      'esds/tokens/1.2.0-rc.200',
    ]);
  });

  it('does not throw when the branches cannot be listed', async () => {
    const fetchMock = vi.fn(async (): Promise<Response> => jsonResponse({}, 500));
    vi.stubGlobal('fetch', fetchMock);

    await expect(deleteGithubObsoletePublishBranches(OPTIONS)).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('throws when the current branch does not match the prefix', async () => {
    await expect(
      deleteGithubObsoletePublishBranches({
        ...OPTIONS,
        currentBranchName: 'esds/symbols/1.2.0',
      }),
    ).rejects.toThrow('does not start with');
  });
});
