import { isNumberFontWeightDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/font-weight/value/types/number/is-number-font-weight-design-token-value.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import { numberFontWeightDesignTokenValueToCssValue } from './types/number/ number-font-weight-design-token-value-to-css-value.ts';
import { predefinedFontWeightDesignTokenValueToCssValue } from './types/predefined/predefined-font-weight-design-token-value-to-css-value.ts';

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-weight
 */
export function fontWeightDesignTokensCollectionTokenValueToCssValue(
  value: FontWeightDesignTokensCollectionTokenValue,
): string {
  return isNumberFontWeightDesignTokenValue(value)
    ? numberFontWeightDesignTokenValueToCssValue(value)
    : predefinedFontWeightDesignTokenValueToCssValue(value);
}
