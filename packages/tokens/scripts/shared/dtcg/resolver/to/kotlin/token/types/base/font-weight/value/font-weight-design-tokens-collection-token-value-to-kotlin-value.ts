import { isNumberFontWeightDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/font-weight/value/types/number/is-number-font-weight-design-token-value.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationFontWeightValue } from '../../../../../kotlin-variable-declaration/value/built-in/font-weight/kotlin-variable-declaration-font-weight-value.ts';
import { numberFontWeightDesignTokenValueToKotlinValue } from './types/number/number-font-weight-design-token-value-to-kotlin-value.ts';
import { predefinedFontWeightDesignTokenValueToKotlinValue } from './types/predefined/predefined-font-weight-design-token-value-to-kotlin-value.ts';

export function fontWeightDesignTokensCollectionTokenValueToKotlinValue(
  value: FontWeightDesignTokensCollectionTokenValue,
): KotlinVariableDeclarationFontWeightValue {
  return isNumberFontWeightDesignTokenValue(value)
    ? numberFontWeightDesignTokenValueToKotlinValue(value)
    : predefinedFontWeightDesignTokenValueToKotlinValue(value);
}
