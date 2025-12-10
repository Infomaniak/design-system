import {
  designTokenReferenceToCssVarReference,
  type DesignTokenReferenceToCssVarReferenceOptions,
} from '../../../../../../../../../../../reference/to/css-var-reference/design-token-reference-to-css-var-reference.ts';
import type { ReferenceBorderDesignTokenValueWidth } from '../../reference-border-design-token-value-width.ts';

export interface ReferenceBorderDesignTokenValueWidthToCssValueOptions extends DesignTokenReferenceToCssVarReferenceOptions {}

export function referenceBorderDesignTokenValueWidthToCssValue(
  color: ReferenceBorderDesignTokenValueWidth,
  options?: ReferenceBorderDesignTokenValueWidthToCssValueOptions,
): string {
  return designTokenReferenceToCssVarReference(color, options);
}
