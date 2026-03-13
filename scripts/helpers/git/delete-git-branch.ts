import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface DeleteGitBranchOptions extends SpawnOptions {
  readonly branchName: string;
  readonly logger: Logger;
}

export async function deleteGitBranch({
  branchName,
  logger,
  ...spanOptions
}: DeleteGitBranchOptions): Promise<void> {
  await execCommandInherit(logger, 'git', ['branch', '-D', branchName], spanOptions);
}
