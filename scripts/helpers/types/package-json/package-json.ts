export interface PackageJson {
  readonly name: string;
  readonly version: string;
  readonly scripts?: PackageJsonScripts;
  readonly dependencies?: PackageJsonDependencies;
}

export type PackageJsonScripts = Record<string, string>;
export type PackageJsonDependencies = Record<string, string>;
