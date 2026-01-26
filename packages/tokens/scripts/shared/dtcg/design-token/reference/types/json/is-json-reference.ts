import { jsonReferenceSchema } from './json-reference.schema.ts';
import type { JsonReference } from './json-reference.ts';

export function isJsonReference(input: unknown): input is JsonReference {
  return jsonReferenceSchema.safeParse(input).success;
}
