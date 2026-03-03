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

async function copyIosFiles({
  logger,
  packageDirectory,
  repoDirectory,
}: CopyFilesContext): Promise<void> {
  await execCommandInherit(
    logger,
    'cp',
    [
      join(packageDirectory, 'EsdsColorRawTokens.swift'),
      `"${join(repoDirectory, 'CatalogApp/DesignSystem Catalog/')}"`,
    ],
    {
      cwd: packageDirectory,
      shell: true,
    },
  );
}

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
