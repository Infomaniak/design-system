import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';
import { cleanSwiftNameSegment } from './clean-swift-name-segment.ts';

export function designTokenNameSegmentsReferenceToSwiftStructName(
  segment: SegmentsReference,
): string {
  return segment
    .map((segment: string): string => {
      segment = cleanSwiftNameSegment(segment);
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join('');
}
