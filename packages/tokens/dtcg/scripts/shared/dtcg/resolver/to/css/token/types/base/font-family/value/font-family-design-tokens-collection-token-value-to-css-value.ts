import { isStringFontFamilyDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/font-family/value/font-family-design-tokens-collection-token-value.ts';
import { stringArrayFontFamilyDesignTokensCollectionTokenValueToCssValue } from './types/string-array/string-array-font-family-design-tokens-collection-token-value-to-css-value.ts';
import { stringFontFamilyDesignTokenValueToCssValue } from './types/string/string-font-family-design-token-value-to-css-value.ts';

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family
 */
export function fontFamilyDesignTokensCollectionTokenValueToCssValue(
  value: FontFamilyDesignTokensCollectionTokenValue,
): string {
  return isStringFontFamilyDesignTokenValue(value)
    ? stringFontFamilyDesignTokenValueToCssValue(value)
    : stringArrayFontFamilyDesignTokensCollectionTokenValueToCssValue(value);
}
