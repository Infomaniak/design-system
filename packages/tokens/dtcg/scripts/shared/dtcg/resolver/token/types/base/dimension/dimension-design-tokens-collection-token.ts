import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from './value/dimension-design-tokens-collection-token-value.ts';

export type DimensionDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'dimension',
  DimensionDesignTokensCollectionTokenValue
>;
