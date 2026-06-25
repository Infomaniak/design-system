import { capitalizeFirstLetter } from '../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import type { SegmentsReference } from '../../segments-reference.ts';

export function segmentsReferenceToPascalCase(reference: SegmentsReference): string {
  return reference
    .flatMap((segment: string): string[] => segment.split(/[-_.]/))
    .map(capitalizeFirstLetter)
    .join('');
}
