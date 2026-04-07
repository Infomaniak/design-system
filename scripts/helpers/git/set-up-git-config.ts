import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface SetUpGitGlobalConfigOptions extends SpawnOptions {
  readonly userName?: string;
  readonly userEmail?: string;
  readonly logger: Logger;
}

/**
 * Init the git config.
 */
export async function setUpGitConfig({
  userName = 'github-actions',
  userEmail = 'github-actions@github.com',
  logger,
  ...spawnOptions
}: SetUpGitGlobalConfigOptions): Promise<void> {
  await execCommandInherit(logger, 'git', ['config', 'user.name', userName], spawnOptions);
  await execCommandInherit(logger, 'git', ['config', 'user.email', userEmail], spawnOptions);
}
