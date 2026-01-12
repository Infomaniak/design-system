import { jsonReferenceSchema } from '../../json-reference.schema.ts';
import type { JsonReference } from '../../json-reference.ts';
import { resolveJsonReference } from '../../resolve/resolve-json-reference.js';
import type { ValueOrJsonReference } from '../value-or-json-reference.js';

export function resolveValueOrJsonReference<GValue>(
  value: ValueOrJsonReference<GValue>,
  root: unknown,
): GValue {
  return jsonReferenceSchema.safeParse(value).success
    ? (resolveJsonReference(value as JsonReference, root).value as GValue)
    : (value as GValue);
}
