import type { CurlyReference } from '../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../border-design-tokens-collection-token-value.ts';

export function isBorderDesignTokensCollectionTokenValueReferencing(
  value: BorderDesignTokensCollectionTokenValue,
  target: CurlyReference,
): boolean {
  return value.color === target || value.width === target || value.style === target;
}
