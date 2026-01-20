import type { CurlyReference } from './curly-reference.ts';

export function isCurlyReference(input: unknown): input is CurlyReference {
  // NOTE: 20x faster than `curlyReferenceSchema.safeParse(input).success`
  return typeof input === 'string' && input.startsWith('{') && input.endsWith('}');
  // return curlyReferenceSchema.safeParse(input).success;
}
