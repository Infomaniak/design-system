import { join } from 'node:path';
import type { PackageJson } from '../../../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';

export interface BumpSvgsPackageJsonVersionOptions {
  readonly packageRootDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function bumpSvgsPackageJsonVersion({
  packageRootDirectory,
  outputDirectory,
  logger,
}: BumpSvgsPackageJsonVersionOptions): Promise<string> {
  return logger.asyncTask('bump-version', async (): Promise<string> => {
    const packageJson: PackageJson = await readPackageJsonFile(
      join(packageRootDirectory, 'package.json'),
    );
    const [major, minor]: readonly string[] = packageJson.version.split('.');
    const version: string = `${major}.${minor}.${Date.now()}`;

    await writeJsonFileSafe(join(outputDirectory, 'package.json'), {
      ...packageJson,
      version,
    });

    return version;
  });
}
