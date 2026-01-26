import type { NumberDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/number/value/number-design-tokens-collection-token-value.ts';

export function numberDesignTokensCollectionTokenValueToCssValue(
  value: NumberDesignTokensCollectionTokenValue,
): string {
  return value.toString(10);
}
