import type { CurlyReference } from '../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ShadowDesignTokensCollectionTokenValue } from '../shadow-design-tokens-collection-token-value.ts';
import { isObjectShadowDesignTokensCollectionTokenValue } from '../types/object/is-object-shadow-design-tokens-collection-token-value.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';
import { isObjectShadowDesignTokensCollectionTokenValueReferencing } from './is-object-shadow-design-tokens-collection-token-value-referencing.ts';

export function isShadowDesignTokensCollectionTokenValueReferencing(
  value: ShadowDesignTokensCollectionTokenValue,
  target: CurlyReference,
): boolean {
  return isObjectShadowDesignTokensCollectionTokenValue(value)
    ? isObjectShadowDesignTokensCollectionTokenValueReferencing(value, target)
    : value.some(
        (shadow: ValueOrCurlyReference<ObjectShadowDesignTokensCollectionTokenValue>): boolean => {
          return isCurlyReference(shadow)
            ? shadow === target
            : isObjectShadowDesignTokensCollectionTokenValueReferencing(shadow, target);
        },
      );
}
