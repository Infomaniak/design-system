import { join } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../../scripts/helpers/misc/exec-command.ts';
import type { CopyFilesContext } from '../create-github-branch.ts';
import { createGithubBranchWithNewFiles } from '../create-github-branch.ts';

export interface CreateGithubBranchOptions {
  readonly logger: Logger;
  readonly repoName: string;
  readonly packageDirectory: string;
  readonly version: string;
}

export interface FilesMoveOptions {
  readonly source: string;
  readonly destination: string;
}

async function copyIosFiles({
  logger,
  packageDirectory,
  repoDirectory,
}: CopyFilesContext): Promise<void> {
  const filesToMove: FilesMoveOptions[] = [
    {
      source: join(packageDirectory, 'EsdsColorRawTokens.swift'),
      destination: join(repoDirectory, 'CatalogApp/DesignSystem Catalog/'),
    },
    {
      source: join(packageDirectory, 'Colors.xcassets'),
      destination: join(repoDirectory, 'Sources/iOSDesignSystem/'),
    },
  ];

  for (const { source, destination } of filesToMove) {
    await execCommandInherit(logger, 'cp', ['-r', source, destination], {
      cwd: packageDirectory,
    });
  }
}

/**
 * Creates a new branch with the updated iOS token files and pushes it to the remote repository.
 *
 * @returns The name of the created branch.
 */
export function createIosGithubBranch({
  logger,
  repoName,
  packageDirectory,
  version,
}: CreateGithubBranchOptions): Promise<string> {
  return createGithubBranchWithNewFiles({
    logger,
    packageDirectory,
    repoName: repoName,
    version,
    copyFiles: copyIosFiles,
  });
}
