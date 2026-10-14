import { glob, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { readTextFile } from '../../../helpers/file/read-text-file.ts';
import { writeTextFileSafe } from '../../../helpers/file/write-text-file-safe.ts';
import { Logger } from '../../../helpers/log/logger.ts';
import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';

const VERSION_HEADING_REGEX = /^## \d+\.\d+\.\d+(?:[-+][\w.-]+)?$/;

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

export interface ListChangelogFilesOptions {
  readonly packagesDirectory: string;
}

export async function listChangelogFiles({
  packagesDirectory,
}: ListChangelogFilesOptions): Promise<readonly string[]> {
  const changelogPaths: string[] = [];

  for await (const changelogPath of glob(join(packagesDirectory, '**/CHANGELOG.md'))) {
    changelogPaths.push(changelogPath);
  }

  return changelogPaths.toSorted();
}

interface ChangelogSnapshot {
  readonly path: string;
  readonly previousContent: string;
}

interface ReadChangelogContentsOptions {
  readonly changelogPaths: readonly string[];
}

async function readChangelogContents({
  changelogPaths,
}: ReadChangelogContentsOptions): Promise<ReadonlyMap<string, string>> {
  return new Map(
    await Promise.all(
      changelogPaths.map(async (changelogPath: string): Promise<[string, string]> => {
        return [changelogPath, await readTextFile(changelogPath)];
      }),
    ),
  );
}

export interface StampNewVersionHeadingsOptions {
  readonly previousContent: string;
  readonly currentContent: string;
  readonly date: string;
}

export function stampNewVersionHeadings({
  previousContent,
  currentContent,
  date,
}: StampNewVersionHeadingsOptions): string {
  const previousLines: ReadonlySet<string> = new Set(previousContent.split('\n'));

  return currentContent
    .split('\n')
    .map((line: string): string => {
      const isNewVersionHeading: boolean =
        VERSION_HEADING_REGEX.test(line) && !previousLines.has(line);

      return isNewVersionHeading ? `${line} (${date})` : line;
    })
    .join('\n');
}

export function getUtcTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface StampChangelogFilesOptions {
  readonly changelogSnapshots: readonly ChangelogSnapshot[];
  readonly packagesDirectory: string;
  readonly date: string;
  readonly logger: Logger;
}

async function stampChangelogFiles({
  changelogSnapshots,
  packagesDirectory,
  date,
  logger,
}: StampChangelogFilesOptions): Promise<void> {
  for (const { path: changelogPath, previousContent } of changelogSnapshots) {
    const changelogRelativePath: string = relative(packagesDirectory, changelogPath);

    try {
      const currentContent: string = await readTextFile(changelogPath);
      const stampedContent: string = stampNewVersionHeadings({
        previousContent,
        currentContent,
        date,
      });

      if (stampedContent === currentContent) {
        continue;
      }

      await writeTextFileSafe(changelogPath, stampedContent);

      logger.info(`Added release date (${date}) to ${changelogRelativePath}`);
    } catch (error: unknown) {
      logger.error(`Failed to add release date to ${changelogRelativePath}: ${String(error)}`);
    }
  }
}

export interface RunChangesetVersionOptions {
  readonly changesetDirectory: string;
  readonly packagesDirectory: string;
  readonly logger: Logger;
}

export async function runChangesetVersion({
  changesetDirectory,
  packagesDirectory,
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

  const changelogPaths: readonly string[] = await listChangelogFiles({ packagesDirectory });
  const previousContents: ReadonlyMap<string, string> = await readChangelogContents({
    changelogPaths,
  });

  await execCommandInherit(logger, 'yarn', ['changeset', 'version']);

  const postBumpChangelogPaths: readonly string[] = await listChangelogFiles({ packagesDirectory });
  const changelogSnapshots: readonly ChangelogSnapshot[] = postBumpChangelogPaths.map(
    (changelogPath: string): ChangelogSnapshot => ({
      path: changelogPath,
      previousContent: previousContents.get(changelogPath) ?? '',
    }),
  );

  await stampChangelogFiles({
    changelogSnapshots,
    packagesDirectory,
    date: getUtcTodayIsoDate(),
    logger,
  });

  return true;
}
