import type { DesignTokenReference } from '../../design-token-reference.ts';
import { isCurlyReference } from '../../types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { jsonReferenceToSegmentsReference } from '../../types/json/to/segments-reference/json-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../../types/segments/segments-reference.ts';

/**
 * @deprecated use designTokenReferenceToNormalizedSegmentsReference
 * @see designTokenReferenceToNormalizedSegmentsReference
 */
export function designTokenReferenceToSegmentsReferenceLegacy(
  reference: DesignTokenReference,
): SegmentsReference {
  return isCurlyReference(reference)
    ? curlyReferenceToSegmentsReference(reference)
    : jsonReferenceToSegmentsReference(reference);
}
