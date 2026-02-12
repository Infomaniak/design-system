export const T1_DIRECTORY_NAME = 't1-primitive';
export type T1DirectoryName = typeof T1_DIRECTORY_NAME;

export const T2_DIRECTORY_NAME = 't2-semantic';
export type T2DirectoryName = typeof T2_DIRECTORY_NAME;

export const T3_DIRECTORY_NAME = 't3-component';
export type T3DirectoryName = typeof T3_DIRECTORY_NAME;

export type DesignTokenTier = T1DirectoryName | T2DirectoryName | T3DirectoryName;

export const DESIGN_TOKEN_TIERS: readonly [T1DirectoryName, T2DirectoryName, T3DirectoryName] = [
  't1-primitive',
  't2-semantic',
  't3-component',
];

/* FIGMA BRIDGE */

export const DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTIONS: ReadonlyMap<DesignTokenTier, string> =
  new Map([
    ['t1-primitive', 't1'],
    ['t2-semantic', 't2'],
    ['t3-component', 't3'],
  ]);

export const FIGMA_COLLECTIONS_TO_DESIGN_TOKEN_TIERS: ReadonlyMap<string, DesignTokenTier> =
  new Map<string, DesignTokenTier>(
    DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTIONS.entries().map(
      ([tier, collection]: readonly [DesignTokenTier, string]): readonly [
        string,
        DesignTokenTier,
      ] => [collection, tier],
    ),
  );

export const FIGMA_THEMES = ['light', 'dark'] as const;

export const FIGMA_PRODUCT_COLLECTION = 'product';

export const FIGMA_PRODUCTS = [
  'infomaniak',
  'mail',
  'security',
  'kchat',
  'kdrive',
  'calendar',
  'contacts',
  'knote',
  'euria',
  'swisstransfer',
] as const;
