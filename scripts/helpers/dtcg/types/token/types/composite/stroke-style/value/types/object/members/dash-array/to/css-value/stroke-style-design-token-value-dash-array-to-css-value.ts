import type { StrokeStyleDesignTokenValueDashArrayComponent } from '../../component/stroke-style-design-token-value-dash-array-component.ts';
import {
  strokeStyleDesignTokenValueDashArrayComponentToCssValue,
  type StrokeStyleDesignTokenValueDashArrayComponentToCssValueOptions,
} from '../../component/to/css-value/stroke-style-design-token-value-dash-array-component-to-css-value.ts';
import type { StrokeStyleDesignTokenValueDashArray } from '../../stroke-style-design-token-value-dash-array.ts';

export interface StrokeStyleDesignTokenValueDashArrayOptions extends StrokeStyleDesignTokenValueDashArrayComponentToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/stroke-dasharray
 */
export function strokeStyleDesignTokenValueDashArrayToCssValue(
  array: StrokeStyleDesignTokenValueDashArray,
  options?: StrokeStyleDesignTokenValueDashArrayOptions,
): string {
  return array
    .map((component: StrokeStyleDesignTokenValueDashArrayComponent): string => {
      return strokeStyleDesignTokenValueDashArrayComponentToCssValue(component, options);
    })
    .join(', ');
}
