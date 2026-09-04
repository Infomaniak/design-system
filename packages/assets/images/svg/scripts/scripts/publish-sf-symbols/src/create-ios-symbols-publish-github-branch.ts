import { cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import {
  updateGitRepositoryOnNewBranch,
  type UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { IOS_DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../../../scripts/helpers/github/constants/ios-design-system-repository-name.constant.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { IOS_SYMBOLS_DESTINATION_PATH } from '../../../shared/sf-symbols/sf-symbols-config.ts';

export interface CreateIosSymbolsPublishGithubBranchOptions {
  readonly logger: Logger;
  /** Directory of the generated `ESDSSymbols.xcassets` to copy into the iOS repository. */
  readonly xcassetsDirectory: string;
  readonly version: string;
  readonly branchName: string;
}

/**
 * Creates a new branch with the generated SF Symbols asset catalog and pushes it to the remote
 * iOS repository.
 */
export async function createIosSymbolsPublishGithubBranch({
  logger,
  xcassetsDirectory,
  version,
  branchName,
}: CreateIosSymbolsPublishGithubBranchOptions): Promise<GitChanges> {
  return updateGitRepositoryOnNewBranch({
    repository: `git@${IOS_DESIGN_SYSTEM_REPOSITORY_NAME}:${INFOMANIAK_GITHUB_ORGANIZATION}/${IOS_DESIGN_SYSTEM_REPOSITORY_NAME}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      const destinationDirectory: string = join(cwd, IOS_SYMBOLS_DESTINATION_PATH);

      // Replace the whole asset catalog so removed icons are not kept stale on the iOS side.
      await rm(destinationDirectory, { recursive: true, force: true });
      await cp(xcassetsDirectory, destinationDirectory, { recursive: true, force: true });

      return `chore: Update symbols to ${version}`;
    },
    logger,
    allowEmpty: 'yes-skip-push',
  });
}
