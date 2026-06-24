import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import type { BuildConfig } from '../../build/build-config/build-config.ts';
import type { PackageJson } from '../../file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../file/package-json/read-package-json-file.ts';
import { writeJsonFileSafe } from '../../file/write-json-file-safe.ts';
import type { Logger } from '../../log/logger.ts';
import { removeUndefinedProperties } from '../../misc/object/remove-undefined-properties.ts';
import { removeTrailingSlash } from '../../path/remove-traling-slash.ts';
import { generatePackageJsonBuildVersion } from '../generate-package-json-build-version/generate-package-json-build-version.ts';
import {
  transformPackageJsonPaths,
  type TransformPackageJsonPathsConfig,
} from '../transform-package-json-paths/transform-package-json-paths.ts';

export interface GenerateWorkspaceNpmPackageOptions extends BuildConfig {
  readonly packageDirectory: string;
  readonly workspaceRootDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
  /**
   * Configuration for transforming package.json paths (e.g., stripping /dist prefixes).
   * When provided, paths in main, module, types, and exports fields will be transformed.
   */
  readonly stripDistPaths?: TransformPackageJsonPathsConfig;
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
  stripDistPaths,
}: GenerateWorkspaceNpmPackageOptions): Promise<void> {
  packageDirectory = removeTrailingSlash(packageDirectory);
  workspaceRootDirectory = removeTrailingSlash(workspaceRootDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  return logger.asyncTask('generate-npm-package', async (): Promise<void> => {
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
      sideEffects,
      files,
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

    let packageObject = removeUndefinedProperties({
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
      sideEffects,
      files,
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

    // Resolve any remaining `workspace:*` dependencies to actual versions
    if (packageObject.dependencies !== undefined) {
      const resolvedDependencies: Record<string, string> = { ...packageObject.dependencies };

      for (const [depName, depVersion] of Object.entries(resolvedDependencies)) {
        if (typeof depVersion === 'string' && depVersion.startsWith('workspace:')) {
          const depPackageJson: PackageJson = await readPackageJsonFile(
            join(workspaceRootDirectory, 'node_modules', depName, 'package.json'),
          );
          resolvedDependencies[depName] = depVersion.replace('workspace:*', depPackageJson.version);
        }
      }

      packageObject.dependencies = resolvedDependencies;
    }

    // Apply path transformation if configured
    if (stripDistPaths !== undefined) {
      packageObject = transformPackageJsonPaths(packageObject, stripDistPaths);
    }

    await Promise.all([
      writeJsonFileSafe(join(outputDirectory, 'package.json'), packageObject),
      cp(join(packageDirectory, 'README.md'), join(outputDirectory, 'README.md'), {
        force: true,
      }),
      cp(join(workspaceRootDirectory, 'LICENSE'), join(outputDirectory, 'LICENSE'), {
        force: true,
      }),
    ]);
  });
}
