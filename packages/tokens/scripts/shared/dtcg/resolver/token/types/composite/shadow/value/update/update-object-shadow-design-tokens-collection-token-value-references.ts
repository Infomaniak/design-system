import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import { updateColorDesignTokensCollectionTokenValueReferences } from '../../../../base/color/value/operations/update/update-color-design-tokens-collection-token-value-references.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';

export function updateObjectShadowDesignTokensCollectionTokenValueReferences(
  value: ObjectShadowDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): ObjectShadowDesignTokensCollectionTokenValue {
  return {
    ...value,
    color: updateValueOrCurlyReference(
      value.color,
      update,
      /**
       * NOTE: Curly reference is not official
       */
      updateColorDesignTokensCollectionTokenValueReferences,
    ),
    offsetX: updateValueOrCurlyReference(value.offsetX, update),
    offsetY: updateValueOrCurlyReference(value.offsetY, update),
    blur: updateValueOrCurlyReference(value.blur, update),
    spread: updateValueOrCurlyReference(value.spread, update),
  };
}
