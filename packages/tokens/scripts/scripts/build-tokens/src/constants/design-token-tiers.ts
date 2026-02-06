export const T1_DIRNAME = 't1-primitive';
export type T1Dirname = typeof T1_DIRNAME;

export const T2_DIRNAME = 't2-semantic';
export type T2Dirname = typeof T2_DIRNAME;

export const T3_DIRNAME = 't3-component';
export type T3Dirname = typeof T3_DIRNAME;

export type DesignTokenTier = T1Dirname | T2Dirname | T3Dirname;

export const DESIGN_TOKEN_TIERS: readonly [T1Dirname, T2Dirname, T3Dirname] = [
  't1-primitive',
  't2-semantic',
  't3-component',
];

export const DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTIONS: ReadonlyMap<DesignTokenTier, string> =
  new Map([
    ['t1-primitive', 't1'],
    ['t2-semantic', 't2'],
    ['t3-component', 'Themes'],
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
