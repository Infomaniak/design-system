import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/composite/shadow/value/types/object/object-shadow-design-tokens-collection-token-value.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import {
  colorDesignTokensCollectionTokenValueToCssValue,
  type ColorDesignTokensCollectionTokenValueToCssValueOptions,
} from '../../../../../base/color/value/color-design-tokens-collection-token-value-to-css-value.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../../base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';

export interface ObjectShadowDesignTokensCollectionTokenValueToCssValueOptions
  extends
    ValueOrCurlyReferenceToCssVariableReferenceOptions,
    ColorDesignTokensCollectionTokenValueToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow
 */
export function objectShadowDesignTokensCollectionTokenValueToCssValue(
  value: ObjectShadowDesignTokensCollectionTokenValue,
  options?: ObjectShadowDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  return `${valueOrCurlyReferenceToCssVariableReference(value.offsetX, dimensionDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.offsetY, dimensionDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.blur, dimensionDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.spread, dimensionDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.color, (value: ColorDesignTokensCollectionTokenValue): string => colorDesignTokensCollectionTokenValueToCssValue(value, options), options)}${value.inset ? ' inset' : ''}`;
}
