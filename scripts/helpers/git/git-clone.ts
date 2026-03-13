import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface GitCloneOptions extends SpawnOptions {
  readonly repository: string;
  readonly depth?: number;
  readonly branchName?: string;
  readonly destinationDirectory?: string;
  readonly logger: Logger;
}

/**
 * Clones a git repository.
 */
export async function gitClone({
  repository,
  depth,
  branchName,
  destinationDirectory,
  logger,
  ...spawnOptions
}: GitCloneOptions): Promise<void> {
  const args: string[] = ['clone'];

  if (depth !== undefined) {
    args.push('--depth', String(depth));
  }

  if (branchName !== undefined) {
    args.push('--single-branch', '--branch', branchName);
  }

  args.push(repository);

  if (destinationDirectory !== undefined) {
    args.push(destinationDirectory);
  }

  await execCommandInherit(logger, 'git', args, spawnOptions);
}
