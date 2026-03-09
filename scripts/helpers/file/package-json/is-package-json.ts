import type { PackageJson } from 'synckit';
import { packageJsonSchema } from './package-json.schema.ts';

export function isPackageJson(input: unknown): input is PackageJson {
  return packageJsonSchema.safeParse(input).success;
}
