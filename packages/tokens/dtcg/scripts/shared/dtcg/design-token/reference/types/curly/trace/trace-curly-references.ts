import type { CurlyReference } from '../curly-reference.ts';

export function traceCurlyReferences(references: Iterable<CurlyReference>): string {
  return Array.from(references).join(' -> ');
}
