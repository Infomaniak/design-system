export const T1_DIRECTORY_NAME = 't1-primitive';
export type T1DirectoryName = typeof T1_DIRECTORY_NAME;

export const T2_DIRECTORY_NAME = 't2-semantic';
export type T2DirectoryName = typeof T2_DIRECTORY_NAME;

export const T3_DIRECTORY_NAME = 't3-component';
export type T3DirectoryName = typeof T3_DIRECTORY_NAME;

export type DesignTokenTier = T1DirectoryName | T2DirectoryName | T3DirectoryName;

export const DESIGN_TOKEN_TIERS: readonly [T1DirectoryName, T2DirectoryName, T3DirectoryName] = [
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
];

/* FIGMA BRIDGE */

// COLLECTIONS
export const FIGMA_T1_COLLECTION_NAME = 't1';
export type FigmaT1CollectionName = typeof FIGMA_T1_COLLECTION_NAME;

export const FIGMA_T2_COLLECTION_NAME = 't2';
export type FigmaT2CollectionName = typeof FIGMA_T2_COLLECTION_NAME;

export const FIGMA_T3_COLLECTION_NAME = 't3';
export type FigmaT3CollectionName = typeof FIGMA_T3_COLLECTION_NAME;

export type FigmaTierCollectionName =
  | FigmaT1CollectionName
  | FigmaT2CollectionName
  | FigmaT3CollectionName;

export const DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES: ReadonlyMap<
  string,
  FigmaTierCollectionName
> = new Map([
  [T1_DIRECTORY_NAME, FIGMA_T1_COLLECTION_NAME],
  [T2_DIRECTORY_NAME, FIGMA_T2_COLLECTION_NAME],
  [T3_DIRECTORY_NAME, FIGMA_T3_COLLECTION_NAME],
]);

export const FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS: ReadonlyMap<string, DesignTokenTier> =
  new Map<string, DesignTokenTier>(
    DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES.entries().map(
      ([tier, collection]: readonly [string, FigmaTierCollectionName]): readonly [
        string,
        DesignTokenTier,
      ] => [collection, tier as DesignTokenTier],
    ),
  );
