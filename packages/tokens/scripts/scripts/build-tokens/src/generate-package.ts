import { join } from 'node:path';
import type { BuildConfig } from '../../../../../../scripts/helpers/build/build-config/build-config.ts';
import type { PackageJson } from '../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { block } from '../../../../../../scripts/helpers/misc/block.ts';
import { execCommandInherit } from '../../../../../../scripts/helpers/misc/exec-command.ts';
import { removeUndefinedProperties } from '../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';

export interface GeneratePackageOptions extends BuildConfig {
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
  // shared build options
  mode,
  prerelease,
}: GeneratePackageOptions): Promise<void> {
  rootDirectory = removeTrailingSlash(rootDirectory);
  workspaceRootDirectory = removeTrailingSlash(workspaceRootDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  return logger.asyncTask('generate-package', async (logger: Logger): Promise<void> => {
    const {
      name,
      version,
      type,
      description,
      keywords,
      dependencies,
      peerDependencies,
      optionalDependencies,
    }: PackageJson = await readPackageJsonFile(join(rootDirectory, 'package.json'));

    const buildVersion: string = block(() => {
      if (version.includes('-')) {
        throw new Error(`Invalid version: ${version}.`);
      }

      return mode === 'prod'
        ? version
        : `${version}-${mode}.${prerelease ?? Date.now().toString(10)}`;
    });

    const { author, license, repository }: PackageJson = await readPackageJsonFile(
      join(workspaceRootDirectory, 'package.json'),
    );

    const packageObject = removeUndefinedProperties({
      name,
      version: buildVersion,
      type,
      description,
      keywords,
      author,
      license,
      repository,
      dependencies,
      peerDependencies,
      optionalDependencies,
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
