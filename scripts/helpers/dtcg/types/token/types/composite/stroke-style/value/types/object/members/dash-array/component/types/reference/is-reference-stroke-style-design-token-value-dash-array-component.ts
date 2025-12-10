import { isDesignTokenReference } from '../../../../../../../../../../../../reference/is-design-token-reference.ts';
import type { StrokeStyleDesignTokenValueDashArrayComponent } from '../../stroke-style-design-token-value-dash-array-component.ts';
import type { ReferenceStrokeStyleDesignTokenValueDashArrayComponent } from './reference-stroke-style-design-token-value-dash-array-component.ts';

export function isReferenceStrokeStyleDesignTokenValueDashArrayComponent(
  input: StrokeStyleDesignTokenValueDashArrayComponent,
): input is ReferenceStrokeStyleDesignTokenValueDashArrayComponent {
  return isDesignTokenReference(input);
}
