import type { PackageJsonDependencies } from './package-json-dependencies/package-json-dependencies.ts';

export interface PackageJson {
  readonly name: string;
  readonly version: string;
  readonly type?: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly author?: string;
  readonly license?: string;
  readonly repository?: unknown;
  readonly scripts?: PackageJsonScripts;
  readonly dependencies?: PackageJsonDependencies;
  readonly devDependencies?: PackageJsonDependencies;
  readonly peerDependencies?: PackageJsonDependencies;
  readonly optionalDependencies?: PackageJsonDependencies;
}

export type PackageJsonScripts = Record<string, string>;
