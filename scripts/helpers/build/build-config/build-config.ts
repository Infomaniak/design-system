import type { PackageJsonDependencies } from '../../file/package-json/package-json-dependencies/package-json-dependencies.ts';
import type { BuildMode } from '../build-mode/build-mode.ts';

export interface BuildConfig {
  readonly mode: BuildMode;
  readonly prerelease?: string;
  readonly dependenciesOverride?: PackageJsonDependencies;
}
