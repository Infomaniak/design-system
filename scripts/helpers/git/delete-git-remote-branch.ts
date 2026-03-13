import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface DeleteGitRemoteBranchOptions extends SpawnOptions {
  readonly branchName: string;
  readonly logger: Logger;
}

export async function deleteGitRemoteBranch({
  branchName,
  logger,
  ...spanOptions
}: DeleteGitRemoteBranchOptions): Promise<void> {
  await execCommandInherit(logger, 'git', ['push', 'origin', '--delete', branchName], spanOptions);
}
