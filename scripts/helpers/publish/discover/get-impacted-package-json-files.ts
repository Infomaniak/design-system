import type { SpawnOptions } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import {
  listGitChangedFiles,
  type ListGitChangedFilesOptions,
} from '../../git/list-git-changed-files.ts';
import { block } from '../../misc/block.ts';
import { addTrailingSlash } from '../../path/add-trailing-slash.ts';
import {
  discoverPackageJsonFiles,
  type DiscoverPackageJsonFilesOptions,
  type PackageJsonWithPath,
} from './discover-package-json-files.ts';

export interface GetImpactedPackageJsonFilesOptions
  extends DiscoverPackageJsonFilesOptions, Omit<ListGitChangedFilesOptions, keyof SpawnOptions> {}

/**
 * Identifies and returns a list of impacted `package.json` files based on changes in the repository and dependencies inside a monorepo context.
 *
 * @param {GetImpactedPackageJsonFilesOptions} options - Configuration options for discovering package.json files and listing changed files.
 * @return {Promise<readonly PackageJsonWithPath[]>} A promise resolving to a list of objects representing impacted `package.json` files, each including the file path and its content.
 */
export async function getImpactedPackageJsonFiles(
  options: GetImpactedPackageJsonFilesOptions,
): Promise<readonly PackageJsonWithPath[]> {
  const publishablePackages: Map<string, PackageJsonWithPath> = new Map<
    string,
    PackageJsonWithPath
  >(
    (await Array.fromAsync(discoverPackageJsonFiles(options)))
      .filter(([, { scripts }]: PackageJsonWithPath): boolean => {
        return scripts !== undefined && Reflect.has(scripts, 'publish');
      })
      .map(([path, packageJson]: PackageJsonWithPath): [string, PackageJsonWithPath] => {
        return [packageJson.name, [resolve(path), packageJson]];
      }),
  );

  const changedFiles: readonly string[] = (await listGitChangedFiles(options)).map(
    (path: string): string => {
      return resolve(path);
    },
  );

  const isPackageImpactedMap: Map<string, boolean> = new Map<string, boolean>();

  // TODO: as we use "recursive" on the yarn workspace command, we PROBABLY may only check if the package.json files change => to be tested when we'll have more packages.

  const isPackageImpacted = (packageName: string): boolean => {
    let isImpacted: boolean | undefined = isPackageImpactedMap.get(packageName);

    if (isImpacted === undefined) {
      console.assert(publishablePackages.has(packageName));

      isImpacted = block(() => {
        const [path, { dependencies = {} }]: PackageJsonWithPath =
          publishablePackages.get(packageName)!;

        const packageDirectory: string = addTrailingSlash(dirname(path));

        for (const changedFile of changedFiles) {
          if (changedFile.startsWith(packageDirectory)) {
            return true;
          }
        }

        for (const dependencyName of Object.keys(dependencies)) {
          if (publishablePackages.has(dependencyName) && isPackageImpacted(dependencyName)) {
            return true;
          }
        }

        return false;
      });
    }

    return isImpacted;
  };

  return Array.from(
    publishablePackages.values().filter(([, { name }]: PackageJsonWithPath): boolean => {
      return isPackageImpacted(name);
    }),
  );
}
