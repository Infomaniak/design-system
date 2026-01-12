import type { SegmentsReference } from '../../../segments/segments-reference.js';
import type { JsonReference } from '../../json-reference.js';
import { jsonPointerToSegmentsReference } from '../../members/pointer/to/segments-reference/json-pointer-to-segments-reference.js';

export function jsonReferenceToSegmentsReference(reference: JsonReference): SegmentsReference {
  return jsonPointerToSegmentsReference(reference.$ref);
}
