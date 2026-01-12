import type { JsonPointer } from '../../../../json/members/pointer/json-pointer.js';
import type { SegmentsReference } from '../../../segments-reference.js';

export function segmentsReferenceToJsonPointer(reference: SegmentsReference): JsonPointer {
  return `#/${reference
    .map((segment: string): string => {
      return segment.replaceAll('~', '~0').replaceAll('/', '~1');
    })
    .join('/')}`;
}
