import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';
import { toSwiftVariableName } from './to-swift-variable-name.ts';

export function segmentsToSwiftIdentifier(
  segments: SegmentsReference,
  segmentsToSkip: number,
): string {
  if (segmentsToSkip < 0) return '';
  return toSwiftVariableName(segments.slice(segmentsToSkip));
}
