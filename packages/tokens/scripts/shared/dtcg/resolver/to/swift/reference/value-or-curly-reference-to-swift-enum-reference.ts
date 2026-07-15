import { isCurlyReference } from '../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { curlyReferenceToSwiftEnumReference } from './curly-reference-to-swift-enum-reference.ts';

export function valueOrCurlyReferenceToSwiftEnumReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue: (value: GValue) => string,
): string {
  return isCurlyReference(value) ? curlyReferenceToSwiftEnumReference(value) : mapValue(value);
}
