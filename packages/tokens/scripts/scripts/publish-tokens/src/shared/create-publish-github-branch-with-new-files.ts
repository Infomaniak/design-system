import { rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../../scripts/helpers/misc/exec-command.ts';

export interface CreatePublishGithubBranchCopyFilesContext {
  readonly logger: Logger;
  readonly packageDirectory: string;
  readonly repositoryDirectory: string;
}

export type CreatePublishGithubBranchCopyFilesFunction = (
  context: CreatePublishGithubBranchCopyFilesContext,
) => PromiseLike<void> | void;

export interface CreatePublishGithubBranchWithNewFilesOptions {
  readonly logger: Logger;
  readonly packageDirectory: string;
  readonly repositoryName: string;
  readonly version: string;
  readonly copyFiles: CreatePublishGithubBranchCopyFilesFunction;
}

export async function createPublishGithubBranchWithNewFiles({
  logger,
  packageDirectory,
  repositoryName,
  version,
  copyFiles,
}: CreatePublishGithubBranchWithNewFilesOptions): Promise<string> {
  packageDirectory = resolve(packageDirectory);

  const repositoryDirectory: string = join(packageDirectory, repositoryName);

  await rm(repositoryDirectory, {
    recursive: true,
    force: true,
  });

  await execCommandInherit(
    logger,
    'git',
    ['clone', `git@github.com:Infomaniak/${repositoryName}.git`],
    {
      cwd: packageDirectory,
    },
  );

  await execCommandInherit(logger, 'git', ['checkout', '-b', version], {
    cwd: repositoryDirectory,
  });

  await copyFiles({ logger, packageDirectory, repositoryDirectory });

  await execCommandInherit(logger, 'git', ['add', '.'], {
    cwd: repositoryDirectory,
  });

  await execCommandInherit(logger, 'git', ['config', 'user.name', 'github-actions'], {
    cwd: repositoryDirectory,
  });

  await execCommandInherit(logger, 'git', ['config', 'user.email', 'github-actions@github.com'], {
    cwd: repositoryDirectory,
  });

  await execCommandInherit(logger, 'git', ['commit', '-m', `chore: Update to ${version}`], {
    cwd: repositoryDirectory,
  });

  await execCommandInherit(logger, 'git', ['push', '--set-upstream', 'origin', version], {
    cwd: repositoryDirectory,
  });

  return version;
}
