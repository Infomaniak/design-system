import { join } from 'node:path';
import type { BuildConfig } from '../../build/build-config/build-config.ts';
import type { PackageJson } from '../../file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../file/package-json/read-package-json-file.ts';
import { writeJsonFileSafe } from '../../file/write-json-file-safe.ts';
import type { Logger } from '../../log/logger.ts';
import { execCommandInherit } from '../../misc/exec-command.ts';
import { removeUndefinedProperties } from '../../misc/object/remove-undefined-properties.ts';
import { removeTrailingSlash } from '../../path/remove-traling-slash.ts';
import { generatePackageJsonBuildVersion } from '../generate-package-json-build-version/generate-package-json-build-version.ts';

export interface GenerateWorkspaceNpmPackageOptions extends BuildConfig {
  readonly packageDirectory: string;
  readonly workspaceRootDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function generateWorkspaceNpmPackage({
  packageDirectory,
  workspaceRootDirectory,
  outputDirectory,
  logger,
  // shared build options
  mode,
  prerelease,
  dependenciesOverride,
}: GenerateWorkspaceNpmPackageOptions): Promise<void> {
  packageDirectory = removeTrailingSlash(packageDirectory);
  workspaceRootDirectory = removeTrailingSlash(workspaceRootDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  return logger.asyncTask('generate-package', async (logger: Logger): Promise<void> => {
    const {
      name,
      version,
      type,
      description,
      keywords,
      main,
      module,
      types,
      exports,
      dependencies,
      peerDependencies,
      optionalDependencies,
    }: PackageJson = await readPackageJsonFile(join(packageDirectory, 'package.json'));

    const buildVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
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
      main,
      module,
      types,
      exports,
      dependencies:
        dependencies === undefined || dependenciesOverride === undefined
          ? dependencies
          : {
              ...dependencies,
              ...Object.fromEntries(
                Object.entries(dependenciesOverride).filter(([name]: [string, string]): boolean => {
                  return Reflect.has(dependencies, name);
                }),
              ),
            },
      peerDependencies,
      optionalDependencies,
    });

    return logger.asyncTask('web', async (logger: Logger): Promise<void> => {
      const webOutputDirectory: string = join(outputDirectory, 'web');

      await Promise.all([
        writeJsonFileSafe(join(webOutputDirectory, 'package.json'), packageObject),
        execCommandInherit(logger, 'cp', ['README.md', join(webOutputDirectory, 'README.md')], {
          cwd: packageDirectory,
        }),
        execCommandInherit(logger, 'cp', ['LICENSE', join(webOutputDirectory, 'LICENSE')], {
          cwd: workspaceRootDirectory,
        }),
      ]);
    });
  });
}
