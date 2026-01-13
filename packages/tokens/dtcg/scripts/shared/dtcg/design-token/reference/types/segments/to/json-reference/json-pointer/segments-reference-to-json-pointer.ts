import type { JsonPointer } from '../../../../json/members/pointer/json-pointer.ts';
import type { SegmentsReference } from '../../../segments-reference.ts';

export function segmentsReferenceToJsonPointer(reference: SegmentsReference): JsonPointer {
  return `#/${reference
    .map((segment: string): string => {
      return segment.replaceAll('~', '~0').replaceAll('/', '~1');
    })
    .join('/')}`;
}
