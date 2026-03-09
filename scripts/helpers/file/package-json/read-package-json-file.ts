import { readJsonFile, type ReadJsonFileArguments } from '../read-json-file.ts';
import { packageJsonSchema } from './package-json.schema.ts';
import type { PackageJson } from './package-json.ts';

export type ReadPackageJsonFileArguments = ReadJsonFileArguments;

export async function readPackageJsonFile(
  ...args: ReadPackageJsonFileArguments
): Promise<PackageJson> {
  return packageJsonSchema.parse(await readJsonFile<PackageJson>(...args));
}
