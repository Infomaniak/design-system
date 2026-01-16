import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from './value/color-design-tokens-collection-token-value.ts';

export type ColorDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'color',
  ColorDesignTokensCollectionTokenValue
>;
