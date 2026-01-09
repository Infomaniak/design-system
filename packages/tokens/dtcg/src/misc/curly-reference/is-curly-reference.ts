import type { CurlyReference } from './curly-reference.ts';

export function isCurlyReference(input: unknown): input is CurlyReference {
  return typeof input === 'string' && input.startsWith('{') && input.endsWith('}');
}
