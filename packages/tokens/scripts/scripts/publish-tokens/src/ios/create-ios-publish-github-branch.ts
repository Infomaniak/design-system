import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import type { GitChanges } from '../../../../../../../scripts/helpers/git/git-changes.ts';
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
  readonly branchName: string;
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
      await Promise.all([
        cp(
          join(packageDirectory, 'EsdsColorRawTokens.swift'),
          join(cwd, 'CatalogApp/DesignSystem Catalog/EsdsColorRawTokens.swift'),
          {
            force: true,
          },
        ),
        cp(join(packageDirectory, 'Colors.xcassets'), join(cwd, 'Sources/iOSDesignSystem'), {
          recursive: true,
          force: true,
        }),
      ]);

      return `chore: Update to ${version}`;
    },
    logger,
  });
}
