import type { CurlyReference } from '../curly-reference.ts';

export interface UpdateCurlyReference {
  (reference: CurlyReference): CurlyReference;
}
