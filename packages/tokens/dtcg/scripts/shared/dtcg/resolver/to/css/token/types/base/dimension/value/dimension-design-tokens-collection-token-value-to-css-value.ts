import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';

export function dimensionDesignTokensCollectionTokenValueToCssValue(
  value: DimensionDesignTokensCollectionTokenValue,
): string {
  return `${value.value.toString(10)}${value.unit}`;
}
