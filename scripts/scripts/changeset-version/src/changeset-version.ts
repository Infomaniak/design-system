import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Logger } from '../../../helpers/log/logger.ts';
import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';

export interface ChangesetFile {
  readonly name: string;
  readonly path: string;
}

export interface ListChangesetFilesOptions {
  readonly changesetDirectory: string;
}

export async function listChangesetFiles({
  changesetDirectory,
}: ListChangesetFilesOptions): Promise<readonly ChangesetFile[]> {
  const entryNames: readonly string[] = await readdir(changesetDirectory);

  return entryNames
    .filter((entryName: string): boolean => {
      return entryName.endsWith('.md') && entryName !== 'README.md';
    })
    .toSorted()
    .map((entryName: string): ChangesetFile => {
      return {
        name: entryName,
        path: join(changesetDirectory, entryName),
      };
    });
}

export interface RunChangesetVersionOptions {
  readonly changesetDirectory: string;
  readonly logger: Logger;
}

export async function runChangesetVersion({
  changesetDirectory,
  logger,
}: RunChangesetVersionOptions): Promise<boolean> {
  const changesetFiles: readonly ChangesetFile[] = await listChangesetFiles({ changesetDirectory });

  if (changesetFiles.length === 0) {
    logger.info('SKIP: No unreleased changesets found.');

    return false;
  }

  logger.info(`Found ${changesetFiles.length} unreleased changeset(s):`);

  for (const { name } of changesetFiles) {
    logger.info(`- ${name}`);
  }

  await execCommandInherit(logger, 'yarn', ['changeset', 'version']);

  return true;
}
