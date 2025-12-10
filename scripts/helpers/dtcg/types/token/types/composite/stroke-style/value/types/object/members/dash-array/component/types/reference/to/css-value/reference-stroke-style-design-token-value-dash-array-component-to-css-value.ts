import {
  designTokenReferenceToCssVarReference,
  type DesignTokenReferenceToCssVarReferenceOptions,
} from '../../../../../../../../../../../../../../reference/to/css-var-reference/design-token-reference-to-css-var-reference.ts';
import type { ReferenceStrokeStyleDesignTokenValueDashArrayComponent } from '../../reference-stroke-style-design-token-value-dash-array-component.ts';

export interface ReferenceStrokeStyleDesignTokenValueDashArrayComponentToCssValueValueOptions extends DesignTokenReferenceToCssVarReferenceOptions {}

export function referenceStrokeStyleDesignTokenValueDashArrayComponentToCssValue(
  reference: ReferenceStrokeStyleDesignTokenValueDashArrayComponent,
  options?: ReferenceStrokeStyleDesignTokenValueDashArrayComponentToCssValueValueOptions,
): string {
  return designTokenReferenceToCssVarReference(reference, options);
}
