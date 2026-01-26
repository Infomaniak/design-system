import type { CurlyReference } from '../../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { curlyReferenceToFigmaReference } from './curly-reference-to-figma-reference.ts';

export function valueOrCurlyReferenceToValueOrFigmaReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue?: (value: GValue) => GValue,
): GValue | CurlyReference;
export function valueOrCurlyReferenceToValueOrFigmaReference<GValue, GNewValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue: (value: GValue) => GNewValue,
): GNewValue | CurlyReference;
export function valueOrCurlyReferenceToValueOrFigmaReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue: (value: GValue) => GValue = (value: GValue): GValue => value,
): GValue | CurlyReference {
  return isCurlyReference(value) ? curlyReferenceToFigmaReference(value) : mapValue(value);
}
