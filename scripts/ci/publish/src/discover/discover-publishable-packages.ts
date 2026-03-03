import { glob } from 'node:fs/promises';
import type { PackageJson } from '../../../../helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../helpers/file/package-json/read-package-json-file.ts';
import { removeTrailingSlash } from '../../../../helpers/path/remove-traling-slash.ts';

import type { PublishablePackage } from './publishable-package.ts';

export interface DiscoverPublishablePackagesOptions {
  readonly packagesDirectory: string;
}

export async function discoverPublishablePackages({
  packagesDirectory,
}: DiscoverPublishablePackagesOptions): Promise<readonly PublishablePackage[]> {
  packagesDirectory = removeTrailingSlash(packagesDirectory);

  const publishablePackages: PublishablePackage[] = [];

  for await (const entry of glob(`${packagesDirectory}/**/package.json`)) {
    const { name, version, scripts, dependencies }: PackageJson = await readPackageJsonFile(entry);

    if (scripts !== undefined && Reflect.has(scripts, 'publish')) {
      publishablePackages.push({
        path: entry,
        name,
        version,
        dependencies: dependencies === undefined ? [] : Object.keys(dependencies),
      });
    }
  }

  return publishablePackages;
}
