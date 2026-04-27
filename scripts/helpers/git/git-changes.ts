import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { block } from '../misc/block.ts';
import { execCommand } from '../misc/exec-command.ts';

export interface GitChangeEntry {
  readonly mode: GitChangeMode;
  readonly file: string;
}

export type GitChangeMode = 'create' | 'update' | 'delete';

export type GitChanges = readonly GitChangeEntry[];

export interface GitChangesOptions extends SpawnOptions {
  readonly logger: Logger;
}

/**
 * Returns the list of changes that happened on the last commit.
 */
export async function gitChanges({
  logger,
  ...spawnOptions
}: GitChangesOptions): Promise<GitChanges> {
  // DOC: https://git-scm.com/docs/git-diff
  const result: string = await execCommand(
    logger,
    'git',
    ['diff', 'HEAD~1', 'HEAD', '--name-status'],
    spawnOptions,
  );

  const lines: readonly string[] = result
    .split('\n')
    .slice(2)
    .map((line: string): string => line.trim())
    .filter((line: string): boolean => line !== '');

  const changes: GitChangeEntry[] = [];

  for (const line of lines) {
    const match: RegExpMatchArray | null = line.match(/^(A|M|D)\s+(.+)$/);

    if (match === null) {
      logger.warn(`Unknown git diff line: ${line}`);
    } else {
      const gitMode: string = match[1];
      const file: string = match[2];

      changes.push({
        mode: block((): GitChangeMode => {
          switch (gitMode) {
            case 'A':
              return 'create';
            case 'M':
              return 'update';
            case 'D':
              return 'delete';
            default:
              throw new Error(`Invalid mode: ${gitMode}`);
          }
        }),
        file,
      });
    }
  }

  return changes;
}
