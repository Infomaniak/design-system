import type { SpawnOptions } from 'node:child_process';
import { Logger } from '../log/logger.ts';
import { execCommand } from '../misc/exec-command.ts';

export interface DoesGitBranchExistOnRemoteOptions extends SpawnOptions {
  readonly branchName: string;
}

/**
 * Checks if a git branch exists on remote.
 */
export async function doesGitBranchExistOnRemote({
  branchName,
  ...spawnOptions
}: DoesGitBranchExistOnRemoteOptions): Promise<boolean> {
  const output: string = await execCommand(
    Logger.never(),
    'git',
    ['ls-remote', '--heads', 'origin', branchName],
    spawnOptions,
  );
  return output.trim().length > 0;
}
