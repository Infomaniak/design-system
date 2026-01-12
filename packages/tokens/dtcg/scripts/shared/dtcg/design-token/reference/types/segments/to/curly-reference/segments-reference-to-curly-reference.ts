import type { CurlyReference } from '../../../curly/curly-reference.js';
import type { SegmentsReference } from '../../segments-reference.js';

export function segmentsReferenceToCurlyReference(reference: SegmentsReference): CurlyReference {
  return `{${reference.join('.')}}`;
}
