import type { CurlyReference } from '../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { isColorDesignTokensCollectionTokenValueReferencing } from '../../../../base/color/value/operations/is-referencing/is-color-design-tokens-collection-token-value-referencing.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';

export function isObjectShadowDesignTokensCollectionTokenValueReferencing(
  value: ObjectShadowDesignTokensCollectionTokenValue,
  target: CurlyReference,
): boolean {
  return (
    (isCurlyReference(value.color)
      ? value.color === target
      : /**
         * NOTE: Curly reference is not official
         */
        isColorDesignTokensCollectionTokenValueReferencing(value.color, target)) ||
    value.offsetX === target ||
    value.offsetY === target ||
    value.blur === target ||
    value.spread === target
  );
}
