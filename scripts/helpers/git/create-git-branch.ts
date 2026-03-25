import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface CreateGitBranchOptions extends SpawnOptions {
  readonly branchName: string;
  readonly startPoint?: string;
  readonly logger: Logger;
}

export async function createGitBranch({
  branchName,
  startPoint = 'HEAD',
  logger,
  ...spawnOptions
}: CreateGitBranchOptions): Promise<void> {
  await execCommandInherit(logger, 'git', ['checkout', '-b', branchName, startPoint], spawnOptions);
}
