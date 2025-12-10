import type { SegmentsDesignTokenReference } from '../../../segments/segments-design-token-reference.ts';
import type { CurlyDesignTokenReference } from '../../curly-design-token-reference.ts';

export function curlyDesignTokenReferenceToPath(
  reference: CurlyDesignTokenReference,
): SegmentsDesignTokenReference {
  return reference.slice(1, -1).split('.');
}
