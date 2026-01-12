import type { SegmentsReference } from '../../../../../segments/segments-reference.js';
import type { JsonPointer } from '../../json-pointer.js';

export function jsonPointerToSegmentsReference(reference: JsonPointer): SegmentsReference {
  return reference === '#' ?
      []
    : reference
        .slice(2)
        .split('/')
        .map((segment: string): string => {
          return segment.replaceAll('~1', '/').replaceAll('~0', '~');
        });
}
