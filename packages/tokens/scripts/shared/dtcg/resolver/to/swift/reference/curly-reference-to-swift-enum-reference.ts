import type { CurlyReference } from '../../../../design-token/reference/types/curly/curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { segmentsReferenceToSwiftEnumReference } from './segments-reference-to-swift-enum-reference.ts';

export function curlyReferenceToSwiftEnumReference(reference: CurlyReference): string {
  return segmentsReferenceToSwiftEnumReference(curlyReferenceToSegmentsReference(reference));
}
