import type { StrokeStyleDesignTokenValueDashArrayComponent } from '../../stroke-style-design-token-value-dash-array-component.ts';
import { isDimensionStrokeStyleDesignTokenValueDashArrayComponent } from '../../types/dimension/is-dimension-stroke-style-design-token-value-dash-array-component.ts';
import { dimensionStrokeStyleDesignTokenValueDashArrayComponentToCssValue } from '../../types/dimension/to/css-value/dimension-stroke-style-design-token-value-dash-array-component-to-css-value.ts';
import {
  referenceStrokeStyleDesignTokenValueDashArrayComponentToCssValue,
  type ReferenceStrokeStyleDesignTokenValueDashArrayComponentToCssValueValueOptions,
} from '../../types/reference/to/css-value/reference-stroke-style-design-token-value-dash-array-component-to-css-value.ts';

export interface StrokeStyleDesignTokenValueDashArrayComponentToCssValueOptions extends ReferenceStrokeStyleDesignTokenValueDashArrayComponentToCssValueValueOptions {}

export function strokeStyleDesignTokenValueDashArrayComponentToCssValue(
  value: StrokeStyleDesignTokenValueDashArrayComponent,
  options?: StrokeStyleDesignTokenValueDashArrayComponentToCssValueOptions,
): string {
  if (isDimensionStrokeStyleDesignTokenValueDashArrayComponent(value)) {
    return dimensionStrokeStyleDesignTokenValueDashArrayComponentToCssValue(value);
  } else {
    return referenceStrokeStyleDesignTokenValueDashArrayComponentToCssValue(value, options);
  }
}
