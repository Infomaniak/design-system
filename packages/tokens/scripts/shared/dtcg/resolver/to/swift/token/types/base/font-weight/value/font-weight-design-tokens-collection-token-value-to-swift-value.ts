import { isNumberFontWeightDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/font-weight/value/types/number/is-number-font-weight-design-token-value.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import { numberFontWeightDesignTokenValueToSwiftValue } from './types/number/number-font-weight-design-token-value-to-swift-value.ts';
import { predefinedFontWeightDesignTokenValueToSwiftValue } from './types/predefined/predefined-font-weight-design-token-value-to-swift-value.ts';

export function fontWeightDesignTokensCollectionTokenValueToSwiftValue(
  value: FontWeightDesignTokensCollectionTokenValue,
): string {
  return isNumberFontWeightDesignTokenValue(value)
    ? numberFontWeightDesignTokenValueToSwiftValue(value)
    : predefinedFontWeightDesignTokenValueToSwiftValue(value);
}
