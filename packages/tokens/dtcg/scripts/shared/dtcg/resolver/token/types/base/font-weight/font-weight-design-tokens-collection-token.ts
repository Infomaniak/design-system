import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from './value/font-weight-design-tokens-collection-token-value.ts';

export type FontWeightDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'fontWeight',
  FontWeightDesignTokensCollectionTokenValue
>;
