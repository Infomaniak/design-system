import type { DesignTokenReference } from '../../design-token-reference.ts';
import { isCurlyReference } from '../../types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { jsonReferenceToSegmentsReference } from '../../types/json/to/segments-reference/json-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../../types/segments/segments-reference.ts';
import { segmentsReferenceToString } from '../../types/segments/to/string/segments-reference-to-string.ts';

export interface DesignTokenReferenceToSegmentsReferenceOptions {
  readonly checkJsonReferenceValue?: boolean;
}

export function designTokenReferenceToSegmentsReference(
  reference: DesignTokenReference,
  { checkJsonReferenceValue = true }: DesignTokenReferenceToSegmentsReferenceOptions = {},
): SegmentsReference {
  if (isCurlyReference(reference)) {
    return curlyReferenceToSegmentsReference(reference);
  } else {
    const segments: SegmentsReference = jsonReferenceToSegmentsReference(reference);

    if (segments.at(-1) === '$value' || !checkJsonReferenceValue) {
      return segments.slice(0, -1);
    } else {
      throw new Error(
        `On reference ${segmentsReferenceToString(segments)}, expected "$value" at the end.`,
      );
    }
  }
}
