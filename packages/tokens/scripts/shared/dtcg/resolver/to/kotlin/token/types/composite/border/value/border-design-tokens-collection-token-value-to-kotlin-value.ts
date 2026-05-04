import type { BorderDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/border/value/border-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationBorderStrokeValue } from '../../../../../kotlin-variable-declaration/value/built-in/border-stroke/kotlin-variable-declaration-border-stroke-value.ts';
import type { KotlinVariableDeclarationValue } from '../../../../../kotlin-variable-declaration/value/kotlin-variable-declaration-value.ts';
import {
  valueOrCurlyReferenceToKotlinVariableReference,
  type ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
} from '../../../../../reference/value-or-curly-reference-to-kotlin-variable-reference.ts';
import { colorDesignTokensCollectionTokenValueToKotlinValue } from '../../../base/color/value/color-design-tokens-collection-token-value-to-kotlin-value.ts';
import { dimensionDesignTokensCollectionTokenValueToKotlinValue } from '../../../base/dimension/value/dimension-design-tokens-collection-token-value-to-kotlin-value.ts';
import { type StrokeStyleDesignTokensCollectionTokenValueToKotlinValueOptions } from '../../stroke-style/value/stroke-style-design-tokens-collection-token-value-to-kotlin-value.ts';

export interface BorderDesignTokensCollectionTokenValueToKotlinValueOptions
  extends
    ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
    StrokeStyleDesignTokensCollectionTokenValueToKotlinValueOptions {}

export function borderDesignTokensCollectionTokenValueToKotlinValue(
  value: BorderDesignTokensCollectionTokenValue,
  options?: BorderDesignTokensCollectionTokenValueToKotlinValueOptions,
): KotlinVariableDeclarationBorderStrokeValue {
  const color: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.color,
    colorDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  const width: KotlinVariableDeclarationValue = valueOrCurlyReferenceToKotlinVariableReference(
    value.width,
    dimensionDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );

  return {
    type: 'BorderStroke',
    value: `BorderStroke(${width.value}, ${color.value})`,
  };
}
