import { isCurlyReference } from '../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import {
  curlyReferenceToCssVariableReference,
  type CurlyReferenceToCssVariableReferenceOptions,
} from './curly-reference-to-css-variable-reference.ts';

export interface ValueOrCurlyReferenceToCssVariableReferenceOptions extends CurlyReferenceToCssVariableReferenceOptions {}

export function valueOrCurlyReferenceToCssVariableReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue: (value: GValue) => string,
  options?: ValueOrCurlyReferenceToCssVariableReferenceOptions,
): string {
  return isCurlyReference(value)
    ? curlyReferenceToCssVariableReference(value, options)
    : mapValue(value);
}
