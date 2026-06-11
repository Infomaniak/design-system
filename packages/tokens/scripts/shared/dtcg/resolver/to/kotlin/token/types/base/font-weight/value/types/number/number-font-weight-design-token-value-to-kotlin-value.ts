import type { NumberFontWeightDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/number/number-font-weight-design-token-value.ts';
import type { KotlinVariableDeclarationFontWeightValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/font-weight/kotlin-variable-declaration-font-weight-value.ts';

export function numberFontWeightDesignTokenValueToKotlinValue(
  value: NumberFontWeightDesignTokenValue,
): KotlinVariableDeclarationFontWeightValue {
  return {
    type: 'FontWeight',
    value: `FontWeight(${value.toString(10)})`,
  };
}
