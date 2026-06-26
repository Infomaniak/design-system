import { cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import {
  updateGitRepositoryOnNewBranch,
  type UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';

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
  const branchName: string = version;

  await updateGitRepositoryOnNewBranch({
    repository: `git@${repositoryName}:${INFOMANIAK_GITHUB_ORGANIZATION}/${repositoryName}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      const mainDirectory: string = join(cwd, 'Sources/DesignSystem');

      await Promise.all(
        ['Colors.xcassets', 'EsdsTheme', 'RawToken'].map((subPath: string): Promise<void> => {
          return rm(join(mainDirectory, subPath), { recursive: true, force: true });
        }),
      );

      await Promise.all([cp(packageDirectory, cwd, { recursive: true, force: true })]);

      return `chore: Update to ${version}`;
    },
    logger,
  });

  return branchName;
}
