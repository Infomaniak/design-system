import type { CurlyReference } from '../../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../color-design-tokens-collection-token-value.ts';

/**
 * NOTE: Curly reference is not official
 */
export function isColorDesignTokensCollectionTokenValueReferencing(
  value: ColorDesignTokensCollectionTokenValue,
  target: CurlyReference,
): boolean {
  return (
    (isCurlyReference(value.components) && value.components === target) ||
    (value.alpha !== undefined && isCurlyReference(value.alpha) && value.alpha === target)
  );
}
