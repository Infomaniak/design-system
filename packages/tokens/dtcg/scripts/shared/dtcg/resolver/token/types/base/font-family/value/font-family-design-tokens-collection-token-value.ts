import type { StringFontFamilyDesignTokenValue } from '../../../../../../design-token/token/types/base/types/font-family/value/types/string/string-font-family-design-token-value.ts';
import type { StringArrayFontFamilyDesignTokensCollectionTokenValue } from './types/string-array/string-array-font-family-design-tokens-collection-token-value.ts';

export type FontFamilyDesignTokensCollectionTokenValue =
  | StringFontFamilyDesignTokenValue
  | StringArrayFontFamilyDesignTokensCollectionTokenValue;
