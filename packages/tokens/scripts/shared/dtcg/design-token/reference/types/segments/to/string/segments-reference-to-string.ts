import type { SegmentsReference } from '../../segments-reference.ts';

export function segmentsReferenceToString(reference: SegmentsReference): string {
  return JSON.stringify(reference);
}
