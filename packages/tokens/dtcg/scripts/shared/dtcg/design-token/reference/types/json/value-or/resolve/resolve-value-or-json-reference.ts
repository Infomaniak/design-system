import { isJsonReference } from '../../is-json-reference.ts';
import { resolveJsonReference } from '../../resolve/resolve-json-reference.js';
import type { ValueOrJsonReference } from '../value-or-json-reference.js';

export function resolveValueOrJsonReference<GValue>(
  value: ValueOrJsonReference<GValue>,
  root: unknown,
): GValue {
  return isJsonReference(value) ? (resolveJsonReference(value, root).value as GValue) : value;
}
