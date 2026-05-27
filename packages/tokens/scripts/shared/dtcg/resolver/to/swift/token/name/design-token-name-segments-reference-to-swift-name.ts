import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';
import { cleanSwiftName, cleanSwiftNameSegment } from './clean-swift-name-segment.ts';

export function segmentsToSwiftIdentifier(
  segments: SegmentsReference,
  segmentsToSkip: number,
): string {
  if (segmentsToSkip < 0) return '';
  const name = segments
    .map((segment: string, index: number): string => {
      if (index < segmentsToSkip) return '';

      segment = cleanSwiftNameSegment(segment);
      return index === segmentsToSkip
        ? segment
        : segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join('');

  return cleanSwiftName(name);
}
