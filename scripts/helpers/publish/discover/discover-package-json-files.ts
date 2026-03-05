import { glob } from 'node:fs/promises';
import type { PackageJson } from '../../file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../file/package-json/read-package-json-file.ts';
import { removeTrailingSlash } from '../../path/remove-traling-slash.ts';

export interface DiscoverPackageJsonFilesOptions {
  readonly packagesDirectory: string;
}

export type PackageJsonWithPath = [path: string, packageJson: PackageJson];

export async function* discoverPackageJsonFiles({
  packagesDirectory,
}: DiscoverPackageJsonFilesOptions): AsyncGenerator<PackageJsonWithPath> {
  packagesDirectory = removeTrailingSlash(packagesDirectory);

  for await (const entry of glob(`${packagesDirectory}/**/package.json`)) {
    yield [entry, await readPackageJsonFile(entry)];
  }
}
