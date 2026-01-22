export const T1_DIRNAME = 't1-primitive';
export type T1Dirname = typeof T1_DIRNAME;

export const T2_DIRNAME = 't2-semantic';
export type T2Dirname = typeof T2_DIRNAME;

export const T3_DIRNAME = 't3-component';
export type T3Dirname = typeof T3_DIRNAME;

// export type DesignTokenTier = 't1-primitive' | 't2-semantic' | 't3-component';

export const DESIGN_TOKEN_TIERS: readonly [T1Dirname, T2Dirname, T3Dirname] = [
  't1-primitive',
  't2-semantic',
  't3-component',
];
