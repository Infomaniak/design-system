import type { CurlyReference } from '../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../typography-design-tokens-collection-token-value.ts';

export function isTypographyDesignTokensCollectionTokenValueReferencing(
  value: TypographyDesignTokensCollectionTokenValue,
  target: CurlyReference,
): boolean {
  return (
    value.fontFamily === target ||
    value.fontSize === target ||
    value.fontWeight === target ||
    value.letterSpacing === target ||
    value.lineHeight === target
  );
}
