import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface AddGitAllFilesOptions extends SpawnOptions {
  readonly logger: Logger;
}

/**
 * Adds all the files to git.
 */
export async function addGitAllFiles({
  logger,
  ...spawnOptions
}: AddGitAllFilesOptions): Promise<void> {
  await execCommandInherit(logger, 'git', ['add', '-A'], spawnOptions);
}
