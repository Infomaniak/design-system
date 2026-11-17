import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ShadowDesignTokensCollectionTokenValue } from '../shadow-design-tokens-collection-token-value.ts';
import { isObjectShadowDesignTokensCollectionTokenValue } from '../types/object/is-object-shadow-design-tokens-collection-token-value.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';
import { updateObjectShadowDesignTokensCollectionTokenValueReferences } from './update-object-shadow-design-tokens-collection-token-value-references.ts';

export function updateShadowDesignTokensCollectionTokenValueReferences(
  value: ShadowDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): ShadowDesignTokensCollectionTokenValue {
  return isObjectShadowDesignTokensCollectionTokenValue(value)
    ? updateObjectShadowDesignTokensCollectionTokenValueReferences(value, update)
    : value.map(
        (
          shadow: ValueOrCurlyReference<ObjectShadowDesignTokensCollectionTokenValue>,
        ): ValueOrCurlyReference<ObjectShadowDesignTokensCollectionTokenValue> => {
          return isCurlyReference(shadow)
            ? update(shadow)
            : updateObjectShadowDesignTokensCollectionTokenValueReferences(shadow, update);
        },
      );
}
