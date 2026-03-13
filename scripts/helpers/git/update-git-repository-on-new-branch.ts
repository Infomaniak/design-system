import { mkdir, rm } from 'node:fs/promises';
import type { Logger } from '../log/logger.ts';
import { addGitAllFiles } from './add-git-all-files.ts';
import { createGitBranch } from './create-git-branch.ts';
import { gitClone } from './git-clone.ts';
import { gitCommit, type GitCommitChange } from './git-commit.ts';
import { gitPush } from './git-push.ts';
import { setUpGitConfig } from './set-up-git-config.ts';

export type UpdateGitRepositoryOnNewBranchUpdateFunction = (
  context: UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
) => PromiseLike<string> | string;

export interface UpdateGitRepositoryOnNewBranchUpdateFunctionContext {
  readonly repository: string;
  readonly branchName: string;
  readonly cwd: string;
  readonly logger: Logger;
}

export interface UpdateGitRepositoryOnNewBranchOptions {
  readonly repository: string;
  readonly branchName: string;
  readonly mainBranchName?: string;
  readonly allowEmpty?: 'yes' | 'no' | 'yes-skip-push';
  readonly update: UpdateGitRepositoryOnNewBranchUpdateFunction;
  readonly cwd?: string;
  readonly logger: Logger;
}

export async function updateGitRepositoryOnNewBranch({
  repository,
  branchName,
  mainBranchName = 'main',
  allowEmpty = 'no',
  update,
  cwd = '.tmp',
  logger,
}: UpdateGitRepositoryOnNewBranchOptions): Promise<readonly GitCommitChange[]> {
  try {
    await rm(cwd, {
      recursive: true,
      force: true,
    });

    await mkdir(cwd, {
      recursive: true,
    });

    await gitClone({
      repository,
      depth: 1,
      branchName: mainBranchName,
      destinationDirectory: '.',
      logger,
      cwd,
    });

    await createGitBranch({
      branchName,
      logger,
      cwd,
    });

    await setUpGitConfig({
      logger,
      cwd,
    });

    const commitMessage: string = await update({
      cwd,
      repository,
      branchName,
      logger,
    });

    await addGitAllFiles({
      logger,
      cwd,
    });

    const changes: readonly GitCommitChange[] = await gitCommit({
      message: commitMessage,
      allowEmpty: allowEmpty !== 'no',
      logger,
      cwd,
    });

    if (changes.length > 0 || allowEmpty !== 'yes-skip-push') {
      await gitPush({
        branchName,
        logger,
        cwd,
      });
    }

    return changes;
  } finally {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  }
}
