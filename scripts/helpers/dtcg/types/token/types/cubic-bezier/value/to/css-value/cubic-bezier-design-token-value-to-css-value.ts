import type { CubicBezierDesignTokenValue } from '../../cubic-bezier-design-token-value.ts';

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/cubic-bezier
 */
export function cubicBezierDesignTokenValueToCssValue(value: CubicBezierDesignTokenValue): string {
  return `cubic-bezier(${value.map(String).join(', ')})`;
}
