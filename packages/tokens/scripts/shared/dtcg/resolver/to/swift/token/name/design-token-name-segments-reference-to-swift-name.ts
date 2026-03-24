import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';
import { cleanSwiftNameSegment } from './clean-swift-name-segment.ts';

export function designTokenNameSegmentsReferenceToSwiftName(segment: SegmentsReference): string {
  return segment
    .map((segment: string, index: number): string => {
      segment = cleanSwiftNameSegment(segment);
      return index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join('');
}
