import {
  designTokenReferenceToCssVarReference,
  type DesignTokenReferenceToCssVarReferenceOptions,
} from '../../../../../../../../../../../reference/to/css-var-reference/design-token-reference-to-css-var-reference.ts';
import type { ReferenceBorderDesignTokenValueStyle } from '../../reference-border-design-token-value-style.ts';

export interface ReferenceBorderDesignTokenValueStyleToCssValueOptions extends DesignTokenReferenceToCssVarReferenceOptions {}

export function referenceBorderDesignTokenValueStyleToCssValue(
  style: ReferenceBorderDesignTokenValueStyle,
  options?: ReferenceBorderDesignTokenValueStyleToCssValueOptions,
): string {
  return designTokenReferenceToCssVarReference(style, options);
}
