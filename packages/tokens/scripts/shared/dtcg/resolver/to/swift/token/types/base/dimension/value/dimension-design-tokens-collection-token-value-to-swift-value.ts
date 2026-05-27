import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';

export function dimensionDesignTokensCollectionTokenValueToSwiftValue(
  value: DimensionDesignTokensCollectionTokenValue,
): string {
  if (value.unit != "px") {
    throw new Error(`Unsupported dimension unit for Swift value conversion: ${value.unit}`);
  }
  return value.value.toString(10);
}
