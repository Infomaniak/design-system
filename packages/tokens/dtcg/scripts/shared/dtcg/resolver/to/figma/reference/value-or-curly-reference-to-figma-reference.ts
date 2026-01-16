import { isCurlyReference } from '../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { curlyReferenceToFigmaReference } from './curly-reference-to-figma-reference.ts';

export function valueOrCurlyReferenceToValueOrFigmaReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue?: (value: GValue) => GValue,
): GValue | string;
export function valueOrCurlyReferenceToValueOrFigmaReference<GValue, GNewValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue: (value: GValue) => GNewValue,
): GNewValue | string;
export function valueOrCurlyReferenceToValueOrFigmaReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  mapValue: (value: GValue) => GValue = (value: GValue): GValue => value,
): GValue | string {
  return isCurlyReference(value) ? curlyReferenceToFigmaReference(value) : mapValue(value);
}
