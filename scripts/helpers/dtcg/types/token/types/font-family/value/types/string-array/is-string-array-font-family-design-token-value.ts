import type { FontFamilyDesignTokenValue } from '../../font-family-design-token-value.ts';
import type { StringArrayFontFamilyDesignTokenValue } from './string-array-font-family-design-token-value.ts';

export function isStringArrayFontFamilyDesignTokenValue(
  input: FontFamilyDesignTokenValue,
): input is StringArrayFontFamilyDesignTokenValue {
  return Array.isArray(input);
}
