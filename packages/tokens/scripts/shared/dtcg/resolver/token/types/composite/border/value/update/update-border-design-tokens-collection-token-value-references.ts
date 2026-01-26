import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../border-design-tokens-collection-token-value.ts';

export function updateBorderDesignTokensCollectionTokenValueReferences(
  value: BorderDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): BorderDesignTokensCollectionTokenValue {
  return {
    color: updateValueOrCurlyReference(value.color, update),
    width: updateValueOrCurlyReference(value.width, update),
    style: updateValueOrCurlyReference(value.style, update),
  };
}
