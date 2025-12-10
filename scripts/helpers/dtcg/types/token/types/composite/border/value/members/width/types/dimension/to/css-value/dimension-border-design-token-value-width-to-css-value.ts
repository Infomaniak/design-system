import { dimensionDesignTokenValueToCssValue } from '../../../../../../../../../dimension/value/to/css-value/dimension-design-token-value-to-css-value.ts';
import type { DimensionBorderDesignTokenValueWidth } from '../../dimension-border-design-token-value-width.ts';

export function dimensionBorderDesignTokenValueWidthToCssValue(
  dimension: DimensionBorderDesignTokenValueWidth,
): string {
  return dimensionDesignTokenValueToCssValue(dimension);
}
