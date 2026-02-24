import { join } from 'node:path';
import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../scripts/helpers/misc/exec-command.ts';
import { removeUndefinedProperties } from '../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';

export interface GeneratePackageOptions {
  readonly rootDirectory: string;
  readonly workspaceRootDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function generatePackage({
  rootDirectory,
  workspaceRootDirectory,
  outputDirectory,
  logger,
}: GeneratePackageOptions): Promise<void> {
  rootDirectory = removeTrailingSlash(rootDirectory);
  workspaceRootDirectory = removeTrailingSlash(workspaceRootDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  return logger.asyncTask('generate-package', async (logger: Logger): Promise<void> => {
    const { name, version, type, description, keywords } = await readJsonFile(
      join(rootDirectory, 'package.json'),
    );

    const { author, license, repository } = await readJsonFile(
      join(workspaceRootDirectory, 'package.json'),
    );

    const packageObject = removeUndefinedProperties({
      name,
      version,
      type,
      description,
      keywords,
      author,
      license,
      repository,
    });

    return logger.asyncTask('web', async (logger: Logger): Promise<void> => {
      const webOutputDirectory: string = join(outputDirectory, 'web');

      await Promise.all([
        writeJsonFileSafe(join(webOutputDirectory, 'package.json'), packageObject),
        execCommandInherit(logger, 'cp', ['README.md', join(webOutputDirectory, 'README.md')], {
          cwd: rootDirectory,
        }),
        execCommandInherit(logger, 'cp', ['LICENSE', join(webOutputDirectory, 'LICENSE')], {
          cwd: workspaceRootDirectory,
        }),
      ]);
    });
  });
}
