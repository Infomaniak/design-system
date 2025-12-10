import type { StringFontFamilyDesignTokenValue } from '../../string-font-family-design-token-value.ts';

export function stringFontFamilyDesignTokenValueToCssValue(
  value: StringFontFamilyDesignTokenValue,
): string {
  return value.includes(' ') ? `"${value}"` : value;
}
