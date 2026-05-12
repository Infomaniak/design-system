import { packageJsonSchema } from './package-json.schema.ts';
import type { PackageJson } from './package-json.ts';

export function isPackageJson(input: unknown): input is PackageJson {
  return packageJsonSchema.safeParse(input).success;
}
