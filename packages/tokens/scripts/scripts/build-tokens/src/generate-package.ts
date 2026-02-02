import { join } from 'node:path';
import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
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
    const { name, version, type, description, keywords } = await readJsonFile(
      join(rootDirectory, 'package.json'),
    );

    await writeJsonFileSafe(
      join(outputDirectory, 'web/package.json'),
      removeUndefinedProperties({
        name,
        version,
        type,
        description,
        keywords,
      }),
    );
  });
}
