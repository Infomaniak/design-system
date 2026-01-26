import type { CurlyReference } from '../../../curly/curly-reference.ts';
import type { SegmentsReference } from '../../segments-reference.ts';

export function segmentsReferenceToCurlyReference(reference: SegmentsReference): CurlyReference {
  return `{${reference.join('.')}}`;
}
