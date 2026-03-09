import { readJsonFile, type ReadJsonFileArguments } from '../read-json-file.ts';
import { packageJsonSchema } from './package-json.schema.ts';
import type { PackageJson } from './package-json.ts';

export type ReadPackageJsonFileArguments = ReadJsonFileArguments;

export async function readPackageJsonFile(
  ...args: ReadPackageJsonFileArguments
): Promise<PackageJson> {
  try {
    return packageJsonSchema.parse(await readJsonFile<PackageJson>(...args));
  } catch (error: unknown) {
    throw new Error(`Failed to read package.json file: ${JSON.stringify(args[0])}`, {
      cause: error,
    });
  }
}
