export type PackageJsonExports =
  | PackageJsonExportsEntryPath
  | PackageJsonExportsList
  | PackageJsonExportEntryObject
  | PackageJsonExportsFallback;

export interface PackageJsonExportsList {
  readonly '.': PackageJsonExportsEntry;
  readonly [key: `./${string}`]: PackageJsonExportsEntryOrFallback;
}

export type PackageJsonExportsEntryPath = string | null;

export type PackageJsonExportsEntry = PackageJsonExportsEntryPath | PackageJsonExportEntryObject;

export type PackageJsonExportsFallback = readonly PackageJsonExportsEntry[];

export type PackageJsonExportsEntryOrFallback =
  | PackageJsonExportsEntry
  | PackageJsonExportsFallback;

export interface PackageJsonExportEntryObject {
  readonly require?: PackageJsonExportsEntryOrFallback;
  readonly import?: PackageJsonExportsEntryOrFallback;
  readonly node?: PackageJsonExportsEntryOrFallback;
  readonly default?: PackageJsonExportsEntryOrFallback;
  readonly types?: PackageJsonExportsEntryOrFallback;
}
