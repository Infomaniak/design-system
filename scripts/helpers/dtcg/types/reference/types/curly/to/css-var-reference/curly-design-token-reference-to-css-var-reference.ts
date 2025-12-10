import {
  segmentsDesignTokenReferenceToCssVarReference,
  type SegmentsDesignTokenReferenceToCssVarReferenceOptions,
} from '../../../segments/to/css-var-reference/segments-design-token-reference-to-css-var-reference.ts';
import type { CurlyDesignTokenReference } from '../../curly-design-token-reference.ts';
import { curlyDesignTokenReferenceToPath } from '../path-design-token-reference/curly-design-token-reference-to-path.ts';

export interface CurlyDesignTokenReferenceToCssVarReferenceOptions extends SegmentsDesignTokenReferenceToCssVarReferenceOptions {}

export function curlyDesignTokenReferenceToCssVarReference(
  reference: CurlyDesignTokenReference,
  options?: CurlyDesignTokenReferenceToCssVarReferenceOptions,
): string {
  return segmentsDesignTokenReferenceToCssVarReference(
    curlyDesignTokenReferenceToPath(reference),
    options,
  );
}
