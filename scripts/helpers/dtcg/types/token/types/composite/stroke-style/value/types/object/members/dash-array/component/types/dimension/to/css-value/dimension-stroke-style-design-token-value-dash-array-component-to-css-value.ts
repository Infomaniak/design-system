import { dimensionDesignTokenValueToCssValue } from '../../../../../../../../../../../../dimension/value/to/css-value/dimension-design-token-value-to-css-value.ts';
import type { DimensionStrokeStyleDesignTokenValueDashArrayComponent } from '../../dimension-stroke-style-design-token-value-dash-array-component.ts';

export function dimensionStrokeStyleDesignTokenValueDashArrayComponentToCssValue(
  value: DimensionStrokeStyleDesignTokenValueDashArrayComponent,
): string {
  return dimensionDesignTokenValueToCssValue(value);
}
