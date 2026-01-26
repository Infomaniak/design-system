import { isCurlyReference } from '../../is-curly-reference.ts';
import type { UpdateCurlyReference } from '../../update/update-curly-reference.ts';
import type { ValueOrCurlyReference } from '../value-or-curly-reference.ts';

export function updateValueOrCurlyReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  update: UpdateCurlyReference,
  updateValue?: (value: GValue, update: UpdateCurlyReference) => GValue,
): ValueOrCurlyReference<GValue>;
export function updateValueOrCurlyReference<GValue, GNewValue>(
  value: ValueOrCurlyReference<GValue>,
  update: UpdateCurlyReference,
  updateValue: (value: GValue, update: UpdateCurlyReference) => GNewValue,
): ValueOrCurlyReference<GNewValue>;
export function updateValueOrCurlyReference<GValue>(
  value: ValueOrCurlyReference<GValue>,
  update: UpdateCurlyReference,
  updateValue: (value: GValue, update: UpdateCurlyReference) => GValue = (value: GValue): GValue =>
    value,
): ValueOrCurlyReference<GValue> {
  return isCurlyReference(value) ? update(value) : updateValue(value, update);
}
