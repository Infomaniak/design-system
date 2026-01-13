import type { SegmentsReference } from '../../../segments/segments-reference.ts';
import type { CurlyReference } from '../../curly-reference.ts';

export function curlyReferenceToSegmentsReference(reference: CurlyReference): SegmentsReference {
  return reference.slice(1, -1).split('.');
}
