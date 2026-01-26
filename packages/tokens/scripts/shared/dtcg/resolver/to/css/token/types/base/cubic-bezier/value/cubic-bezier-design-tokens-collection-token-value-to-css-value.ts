import type { CubicBezierDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/cubic-bezier/value/cubic-bezier-design-tokens-collection-token-value.ts';

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/cubic-bezier
 */
export function cubicBezierDesignTokensCollectionTokenValueToCssValue(
  value: CubicBezierDesignTokensCollectionTokenValue,
): string {
  return `cubic-bezier(${value
    .map((item: number): string => {
      return item.toString(10);
    })
    .join(', ')})`;
}
