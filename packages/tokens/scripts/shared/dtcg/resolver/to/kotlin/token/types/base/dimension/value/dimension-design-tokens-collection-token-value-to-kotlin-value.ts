import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationDpValue } from '../../../../../kotlin-variable-declaration/value/built-in/dp/kotlin-variable-declaration-dp-value.ts';
import type { KotlinVariableDeclarationTextUnitValue } from '../../../../../kotlin-variable-declaration/value/built-in/text-unit/kotlin-variable-declaration-text-unit-value.ts';

export function dimensionDesignTokensCollectionTokenValueToKotlinValue(
  value: DimensionDesignTokensCollectionTokenValue,
): KotlinVariableDeclarationDpValue | KotlinVariableDeclarationTextUnitValue {
  const stringValue: string =
    value.value < 0 ? `(${value.value.toString(10)})` : value.value.toString(10);

  switch (value.unit) {
    case 'px':
      return {
        type: 'Dp',
        value: `${stringValue}.dp`,
      };
    case 'rem':
      return {
        type: 'TextUnit',
        value: `${stringValue}.sp`,
      };
    default:
      throw new Error(`Unsupported unit: ${value.unit}`);
  }
}
