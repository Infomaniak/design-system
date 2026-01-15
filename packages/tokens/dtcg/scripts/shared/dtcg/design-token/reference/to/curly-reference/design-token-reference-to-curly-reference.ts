import type { DesignTokenReference } from '../../design-token-reference.ts';
import type { CurlyReference } from '../../types/curly/curly-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import {
  designTokenReferenceToSegmentsReference,
  type DesignTokenReferenceToSegmentsReferenceOptions,
} from '../segments-reference/design-token-reference-to-segments-reference.ts';

export interface DesignTokenReferenceToCurlyReferenceOptions extends DesignTokenReferenceToSegmentsReferenceOptions {}

export function designTokenReferenceToCurlyReference(
  reference: DesignTokenReference,
  options?: DesignTokenReferenceToCurlyReferenceOptions,
): CurlyReference {
  return segmentsReferenceToCurlyReference(
    designTokenReferenceToSegmentsReference(reference, options),
  );
}
