import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import {
  type CreatePublishGithubBranchCopyFilesContext,
  createPublishGithubBranchWithNewFiles,
} from '../shared/create-publish-github-branch-with-new-files.ts';

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
export function createAndroidPublishGithubBranch({
  logger,
  repositoryName,
  packageDirectory,
  version,
}: CreateAndroidPublishGithubBranchOptions): Promise<string> {
  return createPublishGithubBranchWithNewFiles({
    logger,
    packageDirectory,
    repositoryName,
    version,
    copyFiles: async ({
      packageDirectory,
      repositoryDirectory,
    }: CreatePublishGithubBranchCopyFilesContext): Promise<void> => {
      await Promise.all([
        cp(
          join(packageDirectory, 'compose/EsdsColorRawTokens.kt'),
          join(
            repositoryDirectory,
            'DesignSystem/Compose/src/main/kotlin/com/infomaniak/designsystem/compose/compose/EsdsColorRawTokens.kt',
          ),
          {
            force: true,
          },
        ),
      ]);
    },
  });
}
