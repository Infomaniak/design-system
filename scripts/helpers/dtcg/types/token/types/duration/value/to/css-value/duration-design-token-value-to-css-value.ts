import type { DurationDesignTokenValue } from '../../duration-design-token-value.ts';

export function durationDesignTokenValueToCssValue({
  value,
  unit,
}: DurationDesignTokenValue): string {
  return `${value}${unit}`;
}
