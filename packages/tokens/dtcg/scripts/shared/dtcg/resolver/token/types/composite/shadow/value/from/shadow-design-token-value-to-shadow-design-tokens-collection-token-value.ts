import type { ShadowDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/shadow/value/shadow-design-token-value.ts';
import { isObjectShadowDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/shadow/value/types/object/is-object-shadow-design-token-value.ts';
import type { ShadowDesignTokensCollectionTokenValue } from '../shadow-design-tokens-collection-token-value.ts';
import { objectArrayShadowDesignTokenValueToObjectArrayShadowDesignTokensCollectionTokenValue } from '../types/object-array/from/object-array-shadow-design-token-value-to-object-array-shadow-design-tokens-collection-token-value.ts';
import { objectShadowDesignTokenValueToObjectShadowDesignTokensCollectionTokenValue } from '../types/object/from/object-shadow-design-token-value-to-object-shadow-design-tokens-collection-token-value.ts';

export function shadowDesignTokenValueToShadowDesignTokensCollectionTokenValue(
  $value: ShadowDesignTokenValue,
  root: unknown,
): ShadowDesignTokensCollectionTokenValue {
  return isObjectShadowDesignTokenValue($value)
    ? objectShadowDesignTokenValueToObjectShadowDesignTokensCollectionTokenValue($value, root)
    : objectArrayShadowDesignTokenValueToObjectArrayShadowDesignTokensCollectionTokenValue(
        $value,
        root,
      );
}
