import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommand } from '../misc/exec-command.ts';

export interface ListGitChangedFilesOptions extends SpawnOptions {
  readonly fromCommitId: string;
  readonly toCommitId: string;
  readonly logger: Logger;
}

export async function listGitChangedFiles({
  fromCommitId,
  toCommitId,
  logger,
  ...spawnOptions
}: ListGitChangedFilesOptions): Promise<readonly string[]> {
  const output: string = await execCommand(
    logger,
    'git',
    ['diff', '--name-only', fromCommitId, toCommitId],
    {
      ...spawnOptions,
      shell: true,
    },
  );

  return output
    .split(/\r?\n/)
    .map((line: string): string => line.trim())
    .filter((line: string): boolean => line !== '');
}
