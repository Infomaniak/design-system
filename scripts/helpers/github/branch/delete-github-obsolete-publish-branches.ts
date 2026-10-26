import type { Logger } from '../../log/logger.ts';
import { githubRequest } from '../api/github-request.ts';

export interface DeleteGithubObsoletePublishBranchesOptions {
  readonly owner: string;
  readonly repository: string;
  readonly authToken: string;
  /** Common prefix of the publish branches (e.g. `esds/tokens/`). */
  readonly branchPrefix: string;
  /** Freshly published branch (`${branchPrefix}${version}`): it is kept. */
  readonly currentBranchName: string;
  readonly logger: Logger;
}

/**
 * Deletes the previous publish branches with the same prefix and the same release channel
 * (`prod`, `rc`, `dev`…) as `currentBranchName`. GitHub automatically closes the pull requests
 * whose head branch is deleted.
 *
 * Failures are logged but never thrown: cleanup must not break a successful publish.
 *
 * @returns The deleted branch names.
 */
export async function deleteGithubObsoletePublishBranches({
  owner,
  repository,
  authToken,
  branchPrefix,
  currentBranchName,
  logger,
}: DeleteGithubObsoletePublishBranchesOptions): Promise<readonly string[]> {
  if (!currentBranchName.startsWith(branchPrefix)) {
    throw new Error(`Branch "${currentBranchName}" does not start with "${branchPrefix}".`);
  }

  const channel: string = getPublishVersionChannel(currentBranchName.slice(branchPrefix.length));

  let branchNames: readonly string[];

  try {
    branchNames = await listGithubBranchNamesWithPrefix({
      owner,
      repository,
      authToken,
      branchPrefix,
    });
  } catch (error: unknown) {
    logger.warn(`SKIP (non-blocking): Unable to list "${branchPrefix}*" branches.`, error);
    return [];
  }

  const obsoleteBranchNames: readonly string[] = branchNames.filter(
    (branchName: string): boolean => {
      return (
        branchName !== currentBranchName &&
        getPublishVersionChannel(branchName.slice(branchPrefix.length)) === channel
      );
    },
  );

  const deletedBranchNames: string[] = [];

  for (const branchName of obsoleteBranchNames) {
    try {
      await githubRequest<void>({
        method: 'DELETE',
        path: `/repos/${owner}/${repository}/git/refs/heads/${encodeBranchName(branchName)}`,
        token: authToken,
      });
      deletedBranchNames.push(branchName);
      logger.info(`Deleted obsolete branch "${branchName}" (${owner}/${repository}).`);
    } catch (error: unknown) {
      logger.warn(`SKIP (non-blocking): Unable to delete branch "${branchName}".`, error);
    }
  }

  return deletedBranchNames;
}

/**
 * Returns the release channel of a publish version:
 * `1.2.3` → `prod`, `1.2.3-rc.123` → `rc`, `1.2.3-dev.123` → `dev`.
 */
export function getPublishVersionChannel(version: string): string {
  const separatorIndex: number = version.indexOf('-');

  if (separatorIndex === -1) {
    return 'prod';
  }

  return version.slice(separatorIndex + 1).split('.')[0];
}

/* INTERNAL */

interface ListGithubBranchNamesWithPrefixOptions {
  readonly owner: string;
  readonly repository: string;
  readonly authToken: string;
  readonly branchPrefix: string;
}

interface GithubGitRef {
  readonly ref: string;
}

const HEADS_REF_PREFIX: string = 'refs/heads/';

async function listGithubBranchNamesWithPrefix({
  owner,
  repository,
  authToken,
  branchPrefix,
}: ListGithubBranchNamesWithPrefixOptions): Promise<readonly string[]> {
  const refs: readonly GithubGitRef[] = await githubRequest<readonly GithubGitRef[]>({
    method: 'GET',
    path: `/repos/${owner}/${repository}/git/matching-refs/heads/${encodeBranchName(branchPrefix)}`,
    token: authToken,
  });

  return refs.map(({ ref }: GithubGitRef): string => ref.slice(HEADS_REF_PREFIX.length));
}

function encodeBranchName(branchName: string): string {
  return branchName.split('/').map(encodeURIComponent).join('/');
}
