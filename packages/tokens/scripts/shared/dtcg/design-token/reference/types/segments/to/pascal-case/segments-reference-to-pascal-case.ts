import type { SegmentsReference } from '../../segments-reference.ts';

export function segmentsReferenceToPascalCase(reference: SegmentsReference): string {
  return reference
    .flatMap((segment: string): string[] => segment.split(/[-_.]/))
    .map((part: string): string => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
