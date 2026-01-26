import type { StringArrayFontFamilyDesignTokenValue } from './types/string-array/string-array-font-family-design-token-value.ts';
import type { StringFontFamilyDesignTokenValue } from './types/string/string-font-family-design-token-value.ts';

export type FontFamilyDesignTokenValue =
  | StringFontFamilyDesignTokenValue
  | StringArrayFontFamilyDesignTokenValue;
