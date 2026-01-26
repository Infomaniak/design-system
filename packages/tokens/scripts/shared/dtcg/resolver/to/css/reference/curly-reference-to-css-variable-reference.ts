import type { CurlyReference } from '../../../../design-token/reference/types/curly/curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import {
  segmentsReferenceToCssVariableReference,
  type SegmentsReferenceToCssVariableReferenceOptions,
} from './segments-reference-to-css-variable-reference.ts';

export interface CurlyReferenceToCssVariableReferenceOptions extends SegmentsReferenceToCssVariableReferenceOptions {}

export function curlyReferenceToCssVariableReference(
  reference: CurlyReference,
  options?: CurlyReferenceToCssVariableReferenceOptions,
): string {
  return segmentsReferenceToCssVariableReference(
    curlyReferenceToSegmentsReference(reference),
    options,
  );
}
