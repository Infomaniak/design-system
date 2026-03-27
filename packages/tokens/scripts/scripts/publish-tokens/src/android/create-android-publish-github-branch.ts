import { cp } from 'node:fs/promises';
import { join } from 'node:path';
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
}

/**
 * Creates a new branch with the updated Android token files and pushes it to the remote repository.
 *
 * @returns The name of the created branch.
 */
export async function createAndroidPublishGithubBranch({
  logger,
  repositoryName,
  packageDirectory,
  version,
}: CreateAndroidPublishGithubBranchOptions): Promise<string> {
  const branchName: string = version;

  await updateGitRepositoryOnNewBranch({
    repository: `git@${repositoryName}:${INFOMANIAK_GITHUB_ORGANIZATION}/${repositoryName}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      await Promise.all([
        cp(
          join(packageDirectory, 'compose/EsdsColorRawTokens.kt'),
          join(
            cwd,
            'DesignSystem/Compose/src/main/kotlin/com/infomaniak/designsystem/compose/compose/EsdsColorRawTokens.kt',
          ),
          {
            force: true,
          },
        ),
      ]);

      return `chore: Update to ${version}`;
    },
    logger,
  });

  return branchName;
}
