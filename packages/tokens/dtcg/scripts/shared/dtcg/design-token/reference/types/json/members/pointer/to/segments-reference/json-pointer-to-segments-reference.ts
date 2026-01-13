import type { SegmentsReference } from '../../../../../segments/segments-reference.ts';
import type { JsonPointer } from '../../json-pointer.ts';

export function jsonPointerToSegmentsReference(reference: JsonPointer): SegmentsReference {
  return reference === '#'
    ? []
    : reference
        .slice(2)
        .split('/')
        .map((segment: string): string => {
          return segment.replaceAll('~1', '/').replaceAll('~0', '~');
        });
}
