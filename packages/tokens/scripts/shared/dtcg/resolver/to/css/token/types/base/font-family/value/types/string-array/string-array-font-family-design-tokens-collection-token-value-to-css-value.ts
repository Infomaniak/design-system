import type { StringArrayFontFamilyDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/base/font-family/value/types/string-array/string-array-font-family-design-tokens-collection-token-value.ts';
import { stringFontFamilyDesignTokenValueToCssValue } from '../string/string-font-family-design-token-value-to-css-value.ts';

export function stringArrayFontFamilyDesignTokensCollectionTokenValueToCssValue(
  value: StringArrayFontFamilyDesignTokensCollectionTokenValue,
): string {
  return value.map(stringFontFamilyDesignTokenValueToCssValue).join(', ');
}
