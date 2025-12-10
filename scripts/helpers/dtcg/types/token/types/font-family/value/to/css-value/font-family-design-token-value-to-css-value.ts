import type { FontFamilyDesignTokenValue } from '../../font-family-design-token-value.ts';
import { stringArrayFontFamilyDesignTokenValueToCssValue } from '../../types/string-array/to/css-value/string-array-font-family-design-token-value-to-css-value.ts';
import { isStringFontFamilyDesignTokenValue } from '../../types/string/is-string-font-family-design-token-value.ts';
import { stringFontFamilyDesignTokenValueToCssValue } from '../../types/string/to/css-value/string-font-family-design-token-value-to-css-value.ts';

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family
 */
export function fontFamilyDesignTokenValueToCssValue(value: FontFamilyDesignTokenValue): string {
  if (isStringFontFamilyDesignTokenValue(value)) {
    return stringFontFamilyDesignTokenValueToCssValue(value);
  } else {
    return stringArrayFontFamilyDesignTokenValueToCssValue(value);
  }
}
