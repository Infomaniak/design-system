import type { SpawnOptions } from 'node:child_process';
import { Logger } from '../log/logger.ts';
import { execCommand } from '../misc/exec-command.ts';

export type IsGitSupportedOptions = SpawnOptions;

/**
 * Checks if the "git" command is supported.
 */
export async function isGitSupported(options?: IsGitSupportedOptions): Promise<boolean> {
  try {
    await execCommand(Logger.never(), 'git', ['-v'], options);
    return true;
  } catch {
    return false;
  }
}
