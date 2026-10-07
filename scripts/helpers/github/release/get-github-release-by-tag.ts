import { githubRequest } from '../api/github-request.ts';
import type { GithubRelease } from '../api/types.ts';

export interface GetGithubReleaseByTagOptions {
  readonly owner: string;
  readonly repository: string;
  readonly authToken: string;
  readonly tagName: string;
}

/**
 * Fetches the GitHub release associated with `tagName`, or `null` when no
 * release exists for that tag.
 *
 * The tag name is URL-encoded: tags built from scoped package names contain
 * slashes which would otherwise be interpreted as path segments.
 */
export async function getGithubReleaseByTag({
  owner,
  repository,
  authToken,
  tagName,
}: GetGithubReleaseByTagOptions): Promise<GithubRelease | null> {
  const release: GithubRelease | undefined = await githubRequest<GithubRelease | undefined>({
    method: 'GET',
    path: `/repos/${owner}/${repository}/releases/tags/${encodeURIComponent(tagName)}`,
    token: authToken,
    allowNotFound: true,
  });

  return release ?? null;
}
