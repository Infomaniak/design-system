import type { StrokeStyleDesignTokenValueDashArrayComponent } from '../../stroke-style-design-token-value-dash-array-component.ts';
import type { DimensionStrokeStyleDesignTokenValueDashArrayComponent } from './dimension-stroke-style-design-token-value-dash-array-component.ts';

export function isDimensionStrokeStyleDesignTokenValueDashArrayComponent(
  input: StrokeStyleDesignTokenValueDashArrayComponent,
): input is DimensionStrokeStyleDesignTokenValueDashArrayComponent {
  return typeof input === 'object' && input !== null;
}
