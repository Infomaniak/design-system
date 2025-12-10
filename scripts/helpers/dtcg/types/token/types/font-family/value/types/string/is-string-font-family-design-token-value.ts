import type { FontFamilyDesignTokenValue } from '../../font-family-design-token-value.ts';
import type { StringFontFamilyDesignTokenValue } from './string-font-family-design-token-value.ts';

export function isStringFontFamilyDesignTokenValue(
  input: FontFamilyDesignTokenValue,
): input is StringFontFamilyDesignTokenValue {
  return typeof input === 'string';
}
