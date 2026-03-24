import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';

export function dimensionDesignTokensCollectionTokenValueToSwiftValue(
  value: DimensionDesignTokensCollectionTokenValue,
): string {
  return value.value.toString(10);
}
