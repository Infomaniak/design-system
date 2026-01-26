import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeFileSafe } from '../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { removeUndefinedProperties } from '../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';

export interface GeneratePackageOptions {
  readonly rootDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function generatePackage({
  rootDirectory,
  outputDirectory,
  logger,
}: GeneratePackageOptions): Promise<void> {
  rootDirectory = removeTrailingSlash(rootDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  return logger.asyncTask('generate-package', async (): Promise<void> => {
    const { name, version, type, description, keywords } = JSON.parse(
      await readFile(join(rootDirectory, 'package.json'), {
        encoding: 'utf-8',
      }),
    );

    await writeFileSafe(
      join(outputDirectory, 'web/package.json'),
      JSON.stringify(
        removeUndefinedProperties({
          name,
          version,
          type,
          description,
          keywords,
        }),
        null,
        2,
      ),
      {
        encoding: 'utf-8',
      },
    );
  });
}
