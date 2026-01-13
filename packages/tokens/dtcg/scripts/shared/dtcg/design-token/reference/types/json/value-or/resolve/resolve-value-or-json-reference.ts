import { isJsonReference } from '../../is-json-reference.ts';
import { resolveJsonReference } from '../../resolve/resolve-json-reference.ts';
import type { ValueOrJsonReference } from '../value-or-json-reference.ts';

export function resolveValueOrJsonReference<GValue>(
  value: ValueOrJsonReference<GValue>,
  root: unknown,
): GValue {
  return isJsonReference(value) ? (resolveJsonReference(value, root).value as GValue) : value;
}
