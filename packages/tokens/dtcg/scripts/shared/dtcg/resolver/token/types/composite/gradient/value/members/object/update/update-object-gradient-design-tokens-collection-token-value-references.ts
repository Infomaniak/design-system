import type { UpdateCurlyReference } from '../../../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import type { ObjectGradientDesignTokensCollectionTokenValue } from '../object-gradient-design-tokens-collection-token-value.ts';

export function updateObjectGradientDesignTokensCollectionTokenValueReferences(
  value: ObjectGradientDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): ObjectGradientDesignTokensCollectionTokenValue {
  return {
    color: updateValueOrCurlyReference(value.color, update),
    position: updateValueOrCurlyReference(value.position, update),
  };
}
