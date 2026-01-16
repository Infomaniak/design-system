import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from './value/font-family-design-tokens-collection-token-value.ts';

export type FontFamilyDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'fontFamily',
  FontFamilyDesignTokensCollectionTokenValue
>;
