import { stringFontFamilyDesignTokenValueToCssValue } from '../../../string/to/css-value/string-font-family-design-token-value-to-css-value.ts';
import type { StringArrayFontFamilyDesignTokenValue } from '../../string-array-font-family-design-token-value.ts';

export function stringArrayFontFamilyDesignTokenValueToCssValue(
  value: StringArrayFontFamilyDesignTokenValue,
): string {
  return value.map(stringFontFamilyDesignTokenValueToCssValue).join(', ');
}
