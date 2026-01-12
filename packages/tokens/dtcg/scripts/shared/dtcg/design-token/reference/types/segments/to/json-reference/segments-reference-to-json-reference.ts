import type { JsonReference } from '../../../json/json-reference.js';
import type { SegmentsReference } from '../../segments-reference.js';
import { segmentsReferenceToJsonPointer } from './json-pointer/segments-reference-to-json-pointer.js';

export function segmentsReferenceToJsonReference(reference: SegmentsReference): JsonReference {
  return {
    $ref: segmentsReferenceToJsonPointer(reference),
  };
}
