import type { CurlyReference } from '../../../../dtcg/design-token/reference/types/curly/curly-reference.ts';

export function fixTokensBrueckeCurlyReference(input: CurlyReference): CurlyReference {
  return input.replaceAll('.$root', '') as CurlyReference;
}
