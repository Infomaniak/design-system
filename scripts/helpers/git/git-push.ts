import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface GitPushOptions extends SpawnOptions {
  readonly branchName: string;
  readonly upstream?: string;
  readonly logger: Logger;
}

/**
 * Pushes changes to origin with git.
 */
export async function gitPush({
  branchName,
  upstream = 'origin',
  logger,
  ...spawnOptions
}: GitPushOptions): Promise<void> {
  await execCommandInherit(
    logger,
    'git',
    ['push', '--set-upstream', upstream, branchName],
    spawnOptions,
  );
}
