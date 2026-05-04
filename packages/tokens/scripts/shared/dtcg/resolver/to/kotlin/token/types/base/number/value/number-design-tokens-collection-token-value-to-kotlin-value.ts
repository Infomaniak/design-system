import type { NumberDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/number/value/number-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationFloatValue } from '../../../../../kotlin-variable-declaration/value/built-in/float/kotlin-variable-declaration-float-value.ts';

export function numberDesignTokensCollectionTokenValueToKotlinValue(
  value: NumberDesignTokensCollectionTokenValue,
): KotlinVariableDeclarationFloatValue {
  return {
    type: 'Float',
    value: `${value.toString(10)}f`,
  };
}
