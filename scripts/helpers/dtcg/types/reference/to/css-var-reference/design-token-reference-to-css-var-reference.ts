import type { DesignTokenReference } from '../../design-token-reference.ts';
import { isCurlyDesignTokenReference } from '../../types/curly/is-curly-design-token-reference.ts';
import {
  curlyDesignTokenReferenceToCssVarReference,
  type CurlyDesignTokenReferenceToCssVarReferenceOptions,
} from '../../types/curly/to/css-var-reference/curly-design-token-reference-to-css-var-reference.ts';

export interface DesignTokenReferenceToCssVarReferenceOptions extends CurlyDesignTokenReferenceToCssVarReferenceOptions {}

export function designTokenReferenceToCssVarReference(
  reference: DesignTokenReference,
  options?: DesignTokenReferenceToCssVarReferenceOptions,
): string {
  if (isCurlyDesignTokenReference(reference)) {
    return curlyDesignTokenReferenceToCssVarReference(reference, options);
  } else {
    // TODO implement other reference types
    throw new Error(`TODO: Implement reference type "json-pointer"`);
  }
}
