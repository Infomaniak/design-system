import type { JsonReference } from '../../../json/json-reference.ts';
import type { SegmentsReference } from '../../segments-reference.ts';
import { segmentsReferenceToJsonPointer } from './json-pointer/segments-reference-to-json-pointer.ts';

export function segmentsReferenceToJsonReference(reference: SegmentsReference): JsonReference {
  return {
    $ref: segmentsReferenceToJsonPointer(reference),
  };
}
