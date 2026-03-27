import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommand } from '../misc/exec-command.ts';

export interface GitCommitOptions extends SpawnOptions {
  readonly message: string;
  readonly allowEmpty?: boolean;
  readonly logger: Logger;
}

export interface GitCommitChange {
  readonly mode: 'create'; // TODO "update" and "delete"
  readonly file: string;
}

/**
 * Commits changes with git.
 *
 * @returns `true` if there are files to commit.
 */
export async function gitCommit({
  message,
  allowEmpty = false,
  logger,
  ...spawnOptions
}: GitCommitOptions): Promise<readonly GitCommitChange[]> {
  const args: string[] = ['commit', '-m', message];

  if (allowEmpty) {
    args.push('--allow-empty');
  }

  const result: string = await execCommand(logger, 'git', args, spawnOptions);

  const lines: readonly string[] = result
    .split('\n')
    .slice(2)
    .map((line: string): string => line.trim())
    .filter((line: string): boolean => line !== '');

  const changes: GitCommitChange[] = [];

  for (const line of lines) {
    let match: RegExpMatchArray | null;

    if ((match = line.match(/^create\s+mode\s+\d+\s+(.+)$/)) !== null) {
      changes.push({ mode: 'create', file: match[1] });
    } else {
      logger.warn(`Unknown git commit line: ${line}`);
    }
  }

  return changes;
}
