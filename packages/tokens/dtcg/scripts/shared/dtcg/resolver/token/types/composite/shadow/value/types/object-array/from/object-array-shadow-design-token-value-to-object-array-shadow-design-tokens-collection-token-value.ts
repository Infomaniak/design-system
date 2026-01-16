import type { ValueOrDesignTokenReference } from '../../../../../../../../../design-token/reference/value-or/value-or-design-token-reference.ts';
import type { ObjectArrayShadowDesignTokenValue } from '../../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object-array/object-array-shadow-design-token-value.ts';
import type { ObjectShadowDesignTokenValue } from '../../../../../../../../../design-token/token/types/composite/types/shadow/value/types/object/object-shadow-design-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import { objectShadowDesignTokenValueToObjectShadowDesignTokensCollectionTokenValue } from '../../object/from/object-shadow-design-token-value-to-object-shadow-design-tokens-collection-token-value.ts';
import type { ObjectArrayShadowDesignTokensCollectionTokenValue } from '../object-array-shadow-design-tokens-collection-token-value.ts';

export function objectArrayShadowDesignTokenValueToObjectArrayShadowDesignTokensCollectionTokenValue(
  value: ObjectArrayShadowDesignTokenValue,
  root: unknown,
): ObjectArrayShadowDesignTokensCollectionTokenValue {
  return value.map((component: ValueOrDesignTokenReference<ObjectShadowDesignTokenValue>) => {
    return valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      component,
      (value: ObjectShadowDesignTokenValue) => {
        return objectShadowDesignTokenValueToObjectShadowDesignTokensCollectionTokenValue(
          value,
          root,
        );
      },
    );
  });
}
