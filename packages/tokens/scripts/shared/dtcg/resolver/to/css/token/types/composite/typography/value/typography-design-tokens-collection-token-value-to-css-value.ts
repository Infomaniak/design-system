import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import { fontFamilyDesignTokensCollectionTokenValueToCssValue } from '../../../base/font-family/value/font-family-design-tokens-collection-token-value-to-css-value.ts';
import { fontWeightDesignTokensCollectionTokenValueToCssValue } from '../../../base/font-weight/value/font-weight-design-tokens-collection-token-value-to-css-value.ts';
import { typographyDesignTokensCollectionTokenValueLineHeightToCssValue } from './members/line-height/typography-design-tokens-collection-token-value-line-height-to-css-value.ts';

export type TypographyDesignTokensCollectionTokenValueToCssValueOptions =
  ValueOrCurlyReferenceToCssVariableReferenceOptions;

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font
 */
export function typographyDesignTokensCollectionTokenValueToCssValue(
  value: TypographyDesignTokensCollectionTokenValue,
  options?: TypographyDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  return `${valueOrCurlyReferenceToCssVariableReference(value.fontWeight, fontWeightDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.fontSize, dimensionDesignTokensCollectionTokenValueToCssValue, options)}/${valueOrCurlyReferenceToCssVariableReference(value.lineHeight, typographyDesignTokensCollectionTokenValueLineHeightToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.fontFamily, fontFamilyDesignTokensCollectionTokenValueToCssValue, options)}`;
}
