import type { GithubReleaseAsset } from '../api/types.ts';

export interface UploadGithubReleaseAssetOptions {
  readonly owner: string;
  readonly repository: string;
  readonly releaseId: number;
  readonly authToken: string;
  readonly name: string;
  readonly data: Uint8Array;
}

/**
 * Uploads a single file to an existing GitHub release using the GitHub uploads API.
 */
export async function uploadGithubReleaseAsset({
  owner,
  repository,
  releaseId,
  authToken,
  name,
  data,
}: UploadGithubReleaseAssetOptions): Promise<GithubReleaseAsset> {
  const path: string = `/repos/${owner}/${repository}/releases/${releaseId}/assets?name=${encodeURIComponent(name)}`;

  const response: Response = await fetch(`https://uploads.github.com${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/octet-stream',
      'User-Agent': 'infomaniak-design-system-ci',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: data as Uint8Array<ArrayBuffer>,
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API POST ${path} failed (${response.status}): ${await response.text()}`,
    );
  }

  return (await response.json()) as GithubReleaseAsset;
}
