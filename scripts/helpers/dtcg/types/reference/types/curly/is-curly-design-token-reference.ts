import type { CurlyDesignTokenReference } from './curly-design-token-reference.ts';

export function isCurlyDesignTokenReference(input: unknown): input is CurlyDesignTokenReference {
  return typeof input === 'string' && input.startsWith('{') && input.endsWith('}');
}
