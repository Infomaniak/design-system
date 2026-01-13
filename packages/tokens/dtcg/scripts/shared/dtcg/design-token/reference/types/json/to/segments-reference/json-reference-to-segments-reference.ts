import type { SegmentsReference } from '../../../segments/segments-reference.ts';
import type { JsonReference } from '../../json-reference.ts';
import { jsonPointerToSegmentsReference } from '../../members/pointer/to/segments-reference/json-pointer-to-segments-reference.ts';

export function jsonReferenceToSegmentsReference(reference: JsonReference): SegmentsReference {
  return jsonPointerToSegmentsReference(reference.$ref);
}
