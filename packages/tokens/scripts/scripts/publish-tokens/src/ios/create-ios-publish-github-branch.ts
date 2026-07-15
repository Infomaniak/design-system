import { cp, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { GitChanges } from '../../../../../../../scripts/helpers/git/git-changes.ts';
import {
  updateGitRepositoryOnNewBranch,
  type UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import {
  SWIFT_FOUNDATION_DIR,
  SWIFT_PRIMITIVE_TARGET_DIR,
  SWIFT_PRODUCTS_DIR,
  SWIFT_SOURCES_DIR,
} from '../../../build-tokens/src/build/outputs/swift/swift-constants.ts';

export interface CreateIosPublishGithubBranchOptions {
  readonly logger: Logger;
  readonly repositoryName: string;
  readonly packageDirectory: string;
  readonly version: string;
  readonly branchName: string;
}

const PROTECTED_FOUNDATION_ENTRIES: readonly string[] = ['SwiftUI'];

async function removeDirectoryContentsExcept(
  directory: string,
  keptEntries: readonly string[],
): Promise<void> {
  let entries: readonly string[];

  try {
    entries = await readdir(directory);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return;
    }

    throw error;
  }

  await Promise.all(
    entries
      .filter((entry: string): boolean => !keptEntries.includes(entry))
      .map((entry: string): Promise<void> => {
        return rm(join(directory, entry), { recursive: true, force: true });
      }),
  );
}

/**
 * Creates a new branch with the updated iOS token files and pushes it to the remote repository.
 */
export async function createIosPublishGithubBranch({
  logger,
  repositoryName,
  packageDirectory,
  version,
  branchName,
}: CreateIosPublishGithubBranchOptions): Promise<GitChanges> {
  return updateGitRepositoryOnNewBranch({
    repository: `git@${repositoryName}:${INFOMANIAK_GITHUB_ORGANIZATION}/${repositoryName}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      const sourcesDirectory: string = join(cwd, SWIFT_SOURCES_DIR);

      const directoriesToRemove: readonly string[] = [
        join(sourcesDirectory, SWIFT_PRODUCTS_DIR),
        join(cwd, SWIFT_PRIMITIVE_TARGET_DIR),
      ];

      await Promise.all([
        removeDirectoryContentsExcept(
          join(sourcesDirectory, SWIFT_FOUNDATION_DIR),
          PROTECTED_FOUNDATION_ENTRIES,
        ),
        ...directoriesToRemove.map((directory: string): Promise<void> => {
          return rm(directory, { recursive: true, force: true });
        }),
      ]);

      await cp(packageDirectory, cwd, { recursive: true, force: true });

      return `chore: Update to ${version}`;
    },
    logger,
    allowEmpty: 'yes-skip-push',
  });
}
