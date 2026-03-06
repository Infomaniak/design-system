import type { BuildConfig } from '../../build/build-config/build-config.ts';

export interface GeneratePackageJsonBuildVersionOptions extends Pick<
  BuildConfig,
  'mode' | 'prerelease'
> {
  readonly version: string;
}

export function generatePackageJsonBuildVersion({
  version,
  mode,
  prerelease,
}: GeneratePackageJsonBuildVersionOptions): string {
  if (version.includes('-')) {
    throw new Error(`Invalid version: ${version}.`);
  }

  return mode === 'prod' ? version : `${version}-${mode}.${prerelease ?? Date.now().toString(10)}`;
}
