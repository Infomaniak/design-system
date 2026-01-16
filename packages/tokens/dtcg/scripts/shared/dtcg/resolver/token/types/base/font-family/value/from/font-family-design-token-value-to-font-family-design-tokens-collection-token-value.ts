import type { FontFamilyDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/font-family/value/font-family-design-token-value.ts';
import { isStringFontFamilyDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../font-family-design-tokens-collection-token-value.ts';
import { stringArrayFontFamilyDesignTokenValueToStringArrayFontFamilyDesignTokensCollectionTokenValue } from '../types/string-array/from/string-array-font-family-design-token-value-to-string-array-font-family-design-tokens-collection-token-value.ts';

export function fontFamilyDesignTokenValueToFontFamilyDesignTokensCollectionTokenValue(
  $value: FontFamilyDesignTokenValue,
  root: unknown,
): FontFamilyDesignTokensCollectionTokenValue {
  return isStringFontFamilyDesignTokenValue($value)
    ? $value
    : stringArrayFontFamilyDesignTokenValueToStringArrayFontFamilyDesignTokensCollectionTokenValue(
        $value,
        root,
      );
}
