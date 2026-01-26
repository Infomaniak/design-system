import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { ObjectGradientDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/composite/gradient/value/members/object/object-gradient-design-tokens-collection-token-value.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import {
  colorDesignTokensCollectionTokenValueToCssValue,
  type ColorDesignTokensCollectionTokenValueToCssValueOptions,
} from '../../../../../base/color/value/color-design-tokens-collection-token-value-to-css-value.ts';
import { numberDesignTokensCollectionTokenValueToCssValue } from '../../../../../base/number/value/number-design-tokens-collection-token-value-to-css-value.ts';

export interface ObjectGradientDesignTokensCollectionTokenValueToToCssValueOptions
  extends
    ValueOrCurlyReferenceToCssVariableReferenceOptions,
    ColorDesignTokensCollectionTokenValueToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient
 * @example:  'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)'
 */
export function objectGradientDesignTokensCollectionTokenValueToToCssValue(
  value: ObjectGradientDesignTokensCollectionTokenValue,
  options?: ObjectGradientDesignTokensCollectionTokenValueToToCssValueOptions,
): string {
  return `${valueOrCurlyReferenceToCssVariableReference(value.color, (value: ColorDesignTokensCollectionTokenValue): string => colorDesignTokensCollectionTokenValueToCssValue(value, options), options)} calc(${valueOrCurlyReferenceToCssVariableReference(value.position, numberDesignTokensCollectionTokenValueToCssValue, options)} * 100%)`;
}
