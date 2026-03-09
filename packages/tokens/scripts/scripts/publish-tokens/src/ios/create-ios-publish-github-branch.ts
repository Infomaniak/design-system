import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import type { CreatePublishGithubBranchCopyFilesContext } from '../shared/create-publish-github-branch-with-new-files.ts';
import { createPublishGithubBranchWithNewFiles } from '../shared/create-publish-github-branch-with-new-files.ts';

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
export function createIosPublishGithubBranch({
  logger,
  repositoryName,
  packageDirectory,
  version,
}: CreateIosPublishGithubBranchOptions): Promise<string> {
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
          join(packageDirectory, 'EsdsColorRawTokens.swift'),
          join(repositoryDirectory, 'CatalogApp/DesignSystem Catalog/EsdsColorRawTokens.swift'),
          {
            force: true,
          },
        ),
        cp(
          join(packageDirectory, 'Colors.xcassets'),
          join(repositoryDirectory, 'Sources/iOSDesignSystem'),
          {
            recursive: true,
            force: true,
          },
        ),
      ]);
    },
  });
}
