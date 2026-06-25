import { capitalizeFirstLetter } from '../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';
import { cleanSwiftNameSegment } from './clean-swift-name-segment.ts';

export function designTokenNameSegmentsReferenceToSwiftStructName(
  segment: SegmentsReference,
): string {
  return segment
    .map((segment: string): string => {
      const cleaned = cleanSwiftNameSegment(segment);
      return capitalizeFirstLetter(cleaned);
    })
    .join('');
}
