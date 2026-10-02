import { cp } from 'node:fs/promises';
import type { GitChanges } from '../../../../../../../scripts/helpers/git/git-changes.ts';
import {
  updateGitRepositoryOnNewBranch,
  type UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { formatKotlinFiles } from '../../../../../../../scripts/helpers/kotlin/format-kotlin-files.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { updatePackageVersionsFile } from '../../../../../../../scripts/helpers/publish/update-package-versions-file/update-package-versions-file.ts';

export interface CreateAndroidPublishGithubBranchOptions {
  readonly logger: Logger;
  readonly repositoryName: string;
  readonly packageDirectory: string;
  readonly packageName: string;
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
  packageName,
  version,
  branchName,
}: CreateAndroidPublishGithubBranchOptions): Promise<GitChanges> {
  return updateGitRepositoryOnNewBranch({
    repository: `git@${repositoryName}:${INFOMANIAK_GITHUB_ORGANIZATION}/${repositoryName}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      await Promise.all([
        cp(packageDirectory, cwd, { recursive: true, force: true }),
        updatePackageVersionsFile({
          packageName,
          version,
          cwd,
        }),
      ]);

      await formatKotlinFiles({ cwd, logger });

      return `chore: ${packageName}@${version}`;
    },
    logger,
    allowEmpty: 'yes-skip-push',
  });
}

/* INTERNAL */
