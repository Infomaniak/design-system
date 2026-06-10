import type { GradientDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/gradient/value/gradient-design-tokens-collection-token-value.ts';
import { type ValueOrCurlyReferenceToKotlinVariableReferenceOptions } from '../../../../../reference/value-or-curly-reference-to-kotlin-variable-reference.ts';
import { type ObjectGradientDesignTokensCollectionTokenValueToToKotlinValueOptions } from './members/object/object-gradient-design-tokens-collection-token-value-to-to-kotlin-value.ts';

export interface GradientDesignTokensCollectionTokenValueToKotlinValueOptions
  extends
    ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
    ObjectGradientDesignTokensCollectionTokenValueToToKotlinValueOptions {}

export function gradientDesignTokensCollectionTokenValueToKotlinValue(
  _value: GradientDesignTokensCollectionTokenValue,
  _options?: GradientDesignTokensCollectionTokenValueToKotlinValueOptions,
): never {
  throw new Error('Not implemented: gradientDesignTokensCollectionTokenValueToKotlinValue');
}
