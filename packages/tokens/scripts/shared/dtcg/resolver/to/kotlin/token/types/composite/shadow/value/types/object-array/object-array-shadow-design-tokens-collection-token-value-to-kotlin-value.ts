import type { ObjectArrayShadowDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/composite/shadow/value/types/object-array/object-array-shadow-design-tokens-collection-token-value.ts';
import { type ValueOrCurlyReferenceToKotlinVariableReferenceOptions } from '../../../../../../../reference/value-or-curly-reference-to-kotlin-variable-reference.ts';
import { type ObjectShadowDesignTokensCollectionTokenValueToKotlinValueOptions } from '../object/object-shadow-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface ObjectArrayShadowDesignTokensCollectionTokenValueToKotlinValueOptions
  extends
    ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
    ObjectShadowDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function objectArrayShadowDesignTokensCollectionTokenValueToKotlinValue(
  _value: ObjectArrayShadowDesignTokensCollectionTokenValue,
  _options?: ObjectArrayShadowDesignTokensCollectionTokenValueToKotlinValueOptions,
): never {
  throw new Error(
    'Not implemented: objectArrayShadowDesignTokensCollectionTokenValueToKotlinValue',
  );
}
