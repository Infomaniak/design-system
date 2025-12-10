import type { DimensionDesignTokenValue } from '../../dimension-design-token-value.ts';

export function dimensionDesignTokenValueToCssValue({
  value,
  unit,
}: DimensionDesignTokenValue): string {
  return `${value}${unit}`;
}
