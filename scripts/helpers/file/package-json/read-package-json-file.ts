import type { PathLike, ReadFileOptionsWithStringEncoding } from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { readJsonFile } from '../read-json-file.ts';
import { packageJsonSchema } from './package-json.schema.ts';
import type { PackageJson } from './package-json.ts';

export async function readPackageJsonFile(
  path: PathLike | FileHandle,
  options?: ReadFileOptionsWithStringEncoding,
): Promise<PackageJson> {
  try {
    return packageJsonSchema.parse(await readJsonFile<PackageJson>(path, options));
  } catch (error: unknown) {
    throw new Error(`Failed to read package.json file: ${JSON.stringify(path)}`, {
      cause: error,
    });
  }
}
