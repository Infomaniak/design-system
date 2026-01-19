import type { DurationDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/duration/value/duration-design-tokens-collection-token-value.ts';

export function durationDesignTokensCollectionTokenValueToCssValue(
  value: DurationDesignTokensCollectionTokenValue,
): string {
  return `${value.value.toString(10)}${value.unit}`;
}
