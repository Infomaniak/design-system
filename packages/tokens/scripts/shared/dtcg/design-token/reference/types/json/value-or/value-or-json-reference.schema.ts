import * as z from 'zod';
import { jsonReferenceSchema } from '../json-reference.schema.ts';

export function valueOrJsonReferenceSchema<GValue extends z.core.SomeType>(value: GValue) {
  return z.union([value, jsonReferenceSchema]);
}
