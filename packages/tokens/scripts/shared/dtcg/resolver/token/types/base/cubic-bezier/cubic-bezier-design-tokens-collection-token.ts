import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { CubicBezierDesignTokensCollectionTokenValue } from './value/cubic-bezier-design-tokens-collection-token-value.ts';

export type CubicBezierDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'cubicBezier',
  CubicBezierDesignTokensCollectionTokenValue
>;
