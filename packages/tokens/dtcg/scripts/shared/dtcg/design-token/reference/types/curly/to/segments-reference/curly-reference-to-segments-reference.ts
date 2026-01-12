import type { SegmentsReference } from '../../../segments/segments-reference.js';
import type { CurlyReference } from '../../curly-reference.js';

export function curlyReferenceToSegmentsReference(reference: CurlyReference): SegmentsReference {
  return reference.slice(1, -1).split('.');
}
