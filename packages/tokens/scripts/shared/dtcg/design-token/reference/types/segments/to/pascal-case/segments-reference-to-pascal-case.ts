import type { SegmentsReference } from '../../segments-reference.ts';

export function segmentsReferenceToPascalCase(reference: SegmentsReference): string {
  return reference
    .map((segment: string): string => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}
