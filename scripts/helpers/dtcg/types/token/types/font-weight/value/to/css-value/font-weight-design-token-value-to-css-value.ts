import type { FontWeightDesignTokenValue } from '../../font-weight-design-token-value.ts';
import { numberFontWeightDesignTokenValueToCssValue } from '../../types/number/to/css-value/number-font-weight-design-token-value-to-css-value.ts';
import { predefinedFontWeightDesignTokenValueToCssValue } from '../../types/predefined/to/css-value/predefined-font-weight-design-token-value-to-css-value.ts';

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-weight
 */
export function fontWeightDesignTokenValueToCssValue(value: FontWeightDesignTokenValue): string {
  return typeof value === 'number'
    ? numberFontWeightDesignTokenValueToCssValue(value)
    : predefinedFontWeightDesignTokenValueToCssValue(value);
}
