import type { NumberDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/number/value/number-design-token-value.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../number-design-tokens-collection-token-value.ts';

export function numberDesignTokenValueToNumberDesignTokensCollectionTokenValue(
  $value: NumberDesignTokenValue,
  _root: unknown,
): NumberDesignTokensCollectionTokenValue {
  return $value;
}
