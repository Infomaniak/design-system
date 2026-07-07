import { cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
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
}

/**
 * Creates a new branch with the updated iOS token files and pushes it to the remote repository.
 *
 * @returns The name of the created branch.
 */
export async function createIosPublishGithubBranch({
  logger,
  repositoryName,
  packageDirectory,
  version,
}: CreateIosPublishGithubBranchOptions): Promise<string> {
  const branchName: string = `esds/${version}`;

  await updateGitRepositoryOnNewBranch({
    repository: `git@${repositoryName}:${INFOMANIAK_GITHUB_ORGANIZATION}/${repositoryName}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      const sourcesDirectory: string = join(cwd, SWIFT_SOURCES_DIR);

      const directoriesToRemove: readonly string[] = [
        join(sourcesDirectory, SWIFT_FOUNDATION_DIR),
        join(sourcesDirectory, SWIFT_PRODUCTS_DIR),
        join(cwd, SWIFT_PRIMITIVE_TARGET_DIR),
      ];

      await Promise.all(
        directoriesToRemove.map((directory: string): Promise<void> => {
          return rm(directory, { recursive: true, force: true });
        }),
      );

      await cp(packageDirectory, cwd, { recursive: true, force: true });

      return `chore: Update to ${version}`;
    },
    logger,
  });

  return branchName;
}
