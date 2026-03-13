import type { PackageJsonDependencies } from './package-json-dependencies/package-json-dependencies.ts';
import type { PackageJsonExports } from './package-json-exports/package-json-exports.ts';

export interface PackageJson {
  readonly name: string;
  readonly version: string;
  readonly type?: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly author?: string;
  readonly license?: string;
  readonly repository?: unknown;
  // entry points
  readonly main?: string;
  readonly module?: string;
  readonly types?: string;
  readonly exports?: PackageJsonExports;
  // scripts
  readonly scripts?: PackageJsonScripts;
  // dependencies
  readonly dependencies?: PackageJsonDependencies;
  readonly devDependencies?: PackageJsonDependencies;
  readonly peerDependencies?: PackageJsonDependencies;
  readonly optionalDependencies?: PackageJsonDependencies;
}

export type PackageJsonScripts = Record<string, string>;
