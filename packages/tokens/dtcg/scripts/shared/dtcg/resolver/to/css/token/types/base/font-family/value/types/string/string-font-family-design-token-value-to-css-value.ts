import type { StringFontFamilyDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-family/value/types/string/string-font-family-design-token-value.ts';

export function stringFontFamilyDesignTokenValueToCssValue(
  value: StringFontFamilyDesignTokenValue,
): string {
  return value.includes(' ') ? `"${value}"` : value;
}
