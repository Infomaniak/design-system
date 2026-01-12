import { jsonPointerSchema } from './json-pointer.schema.ts';
import type { JsonPointer } from './json-pointer.ts';

export function isJsonPointer(input: unknown): input is JsonPointer {
  return jsonPointerSchema.safeParse(input).success;
}
