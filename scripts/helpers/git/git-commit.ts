import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface GitCommitOptions extends SpawnOptions {
  readonly message: string;
  readonly allowEmpty?: boolean;
  readonly logger: Logger;
}

/**
 * Commits changes with git.
 */
export async function gitCommit({
  message,
  allowEmpty = false,
  logger,
  ...spawnOptions
}: GitCommitOptions): Promise<void> {
  const args: string[] = ['commit', '-m', message];

  if (allowEmpty) {
    args.push('--allow-empty');
  }

  // DOC: https://git-scm.com/docs/git-commit
  await execCommandInherit(logger, 'git', args, spawnOptions);
}
