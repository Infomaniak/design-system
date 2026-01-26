import type { StrokeStyleDesignTokenValueDashArray } from './members/dash-array/stroke-style-design-token-value-dash-array.ts';
import type { StrokeStyleDesignTokenValueLineCap } from './members/line-cap/stroke-style-design-token-value-line-cap.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/format/#object-value
 */
export interface ObjectStrokeStyleDesignTokenValue {
  readonly dashArray: StrokeStyleDesignTokenValueDashArray;
  readonly lineCap: StrokeStyleDesignTokenValueLineCap;
}
