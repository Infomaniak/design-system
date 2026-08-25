import { cp } from 'node:fs/promises';
import type { GitChanges } from '../../../../../../../scripts/helpers/git/git-changes.ts';
import {
  updateGitRepositoryOnNewBranch,
  type UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';

export interface CreateAndroidPublishGithubBranchOptions {
  readonly logger: Logger;
  readonly repositoryName: string;
  readonly packageDirectory: string;
  readonly version: string;
  readonly branchName: string;
}

/**
 * Creates a new branch with the updated Android token files and pushes it to the remote repository.
 */
export function createAndroidPublishGithubBranch({
  logger,
  repositoryName,
  packageDirectory,
  version,
  branchName,
}: CreateAndroidPublishGithubBranchOptions): Promise<GitChanges> {
  return updateGitRepositoryOnNewBranch({
    repository: `git@${repositoryName}:${INFOMANIAK_GITHUB_ORGANIZATION}/${repositoryName}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      await Promise.all([cp(packageDirectory, cwd, { recursive: true, force: true })]);

      // NOTE: ktlintFormat disabled as it multiplies build time by ~x10
      //  as a replacement, we try to output directly well formated and optimized kotlin files
      // await execCommandInherit(logger, './gradlew', ['ktlintFormat'], {
      //   shell: true,
      //   cwd,
      // });

      return `chore: Update to ${version}`;
    },
    logger,
    allowEmpty: 'yes-skip-push',
  });
}
