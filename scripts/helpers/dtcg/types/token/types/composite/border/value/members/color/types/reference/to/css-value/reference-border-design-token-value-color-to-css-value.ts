import {
  designTokenReferenceToCssVarReference,
  type DesignTokenReferenceToCssVarReferenceOptions,
} from '../../../../../../../../../../../reference/to/css-var-reference/design-token-reference-to-css-var-reference.ts';
import type { ReferenceBorderDesignTokenValueColor } from '../../reference-border-design-token-value-color.ts';

export interface ReferenceBorderDesignTokenValueColorToCssValueOptions extends DesignTokenReferenceToCssVarReferenceOptions {}

export function referenceBorderDesignTokenValueColorToCssValue(
  color: ReferenceBorderDesignTokenValueColor,
  options?: ReferenceBorderDesignTokenValueColorToCssValueOptions,
): string {
  return designTokenReferenceToCssVarReference(color, options);
}
