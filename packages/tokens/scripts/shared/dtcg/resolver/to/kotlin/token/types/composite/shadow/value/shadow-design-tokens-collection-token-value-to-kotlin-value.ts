import type { ShadowDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/shadow/value/shadow-design-tokens-collection-token-value.ts';
import { isObjectShadowDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/shadow/value/types/object/is-object-shadow-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationShadowValue } from '../../../../../kotlin-variable-declaration/value/built-in/shadow/kotlin-variable-declaration-shadow-value.ts';
import {
  objectArrayShadowDesignTokensCollectionTokenValueToKotlinValue,
  type ObjectArrayShadowDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './types/object-array/object-array-shadow-design-tokens-collection-token-value-to-kotlin-value.ts';
import {
  objectShadowDesignTokensCollectionTokenValueToKotlinValue,
  type ObjectShadowDesignTokensCollectionTokenValueToKotlinValueOptions,
} from './types/object/object-shadow-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface ShadowDesignTokensCollectionTokenValueToKotlinValueOptions
  extends
    ObjectShadowDesignTokensCollectionTokenValueToKotlinValueOptions,
    ObjectArrayShadowDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function shadowDesignTokensCollectionTokenValueToKotlinValue(
  value: ShadowDesignTokensCollectionTokenValue,
  options?: ShadowDesignTokensCollectionTokenValueToKotlinValueOptions,
): KotlinVariableDeclarationShadowValue {
  return isObjectShadowDesignTokensCollectionTokenValue(value)
    ? objectShadowDesignTokensCollectionTokenValueToKotlinValue(value, options)
    : objectArrayShadowDesignTokensCollectionTokenValueToKotlinValue(value, options);
}
