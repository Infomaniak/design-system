import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../typography-design-tokens-collection-token-value.ts';

export function updateTypographyDesignTokensCollectionTokenValueReferences(
  value: TypographyDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): TypographyDesignTokensCollectionTokenValue {
  return {
    fontFamily: updateValueOrCurlyReference(value.fontFamily, update),
    fontSize: updateValueOrCurlyReference(value.fontSize, update),
    fontWeight: updateValueOrCurlyReference(value.fontWeight, update),
    letterSpacing: updateValueOrCurlyReference(value.letterSpacing, update),
    lineHeight: updateValueOrCurlyReference(value.lineHeight, update),
  };
}
