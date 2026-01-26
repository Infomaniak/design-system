import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import type { BorderDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/border/value/border-design-tokens-collection-token-value.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/stroke-style/value/stroke-style-design-tokens-collection-token-value.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import {
  colorDesignTokensCollectionTokenValueToCssValue,
  type ColorDesignTokensCollectionTokenValueToCssValueOptions,
} from '../../../base/color/value/color-design-tokens-collection-token-value-to-css-value.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import {
  strokeStyleDesignTokensCollectionTokenValueToCssValue,
  type StrokeStyleDesignTokensCollectionTokenValueToCssValueOptions,
} from '../../stroke-style/value/stroke-style-design-tokens-collection-token-value-to-css-value.ts';

export interface BorderDesignTokensCollectionTokenValueToCssValueOptions
  extends
    ValueOrCurlyReferenceToCssVariableReferenceOptions,
    StrokeStyleDesignTokensCollectionTokenValueToCssValueOptions,
    ColorDesignTokensCollectionTokenValueToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border
 */
export function borderDesignTokensCollectionTokenValueToCssValue(
  value: BorderDesignTokensCollectionTokenValue,
  options?: BorderDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  return `${valueOrCurlyReferenceToCssVariableReference(value.width, dimensionDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.style, (value: StrokeStyleDesignTokensCollectionTokenValue): string => strokeStyleDesignTokensCollectionTokenValueToCssValue(value, options), options)} ${valueOrCurlyReferenceToCssVariableReference(value.color, (value: ColorDesignTokensCollectionTokenValue): string => colorDesignTokensCollectionTokenValueToCssValue(value, options), options)}`;
}
