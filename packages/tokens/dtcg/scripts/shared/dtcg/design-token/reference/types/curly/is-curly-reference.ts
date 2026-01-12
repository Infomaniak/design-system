import { curlyReferenceSchema } from './curly-reference.schema.ts';
import type { CurlyReference } from './curly-reference.ts';

export function isCurlyReference(input: unknown): input is CurlyReference {
  return curlyReferenceSchema.safeParse(input).success;
}
