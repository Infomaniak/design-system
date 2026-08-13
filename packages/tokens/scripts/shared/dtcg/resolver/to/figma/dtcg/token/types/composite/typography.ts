import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { isNumberTypographyDesignTokenValueLineHeight } from '../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/number/is-number-typography-design-token-value-line-height.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/font-family/value/font-family-design-tokens-collection-token-value.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import type { TypographyDesignTokensCollectionToken } from '../../../../../../token/types/composite/typography/typography-design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../token/types/composite/typography/value/members/line-height/typography-design-tokens-collection-token-value-line-height.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import type { StringFigmaDesignToken } from '../../../../figma/token/types/string/string-figma-design-token.ts';
import { compositeDesignTokensCollectionTokenToFigmaDesignToken } from '../../composite-design-tokens-collection-token-to-figma-design-token.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/dimension.ts';
import { fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken } from '../base/font-family.ts';
import { fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/font-weight.ts';
import { numberDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/number.ts';

export function typographyDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: TypographyDesignTokensCollectionToken,
): FigmaDesignTokensGroup {
  return compositeDesignTokensCollectionTokenToFigmaDesignToken(token, {
    fontFamily: (
      value: ValueOrCurlyReference<FontFamilyDesignTokensCollectionTokenValue>,
    ): StringFigmaDesignToken =>
      fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken({
        ...token,
        type: 'fontFamily',
        value,
      }),
    fontSize: (
      value: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>,
    ): NumberFigmaDesignToken =>
      dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'dimension',
        value,
      }),
    fontWeight: (
      value: ValueOrCurlyReference<FontWeightDesignTokensCollectionTokenValue>,
    ): NumberFigmaDesignToken =>
      fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'fontWeight',
        value,
      }),
    letterSpacing: (
      value: ValueOrCurlyReference<DimensionDesignTokensCollectionTokenValue>,
    ): NumberFigmaDesignToken =>
      dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'dimension',
        value,
      }),
    lineHeight: (
      value: ValueOrCurlyReference<TypographyDesignTokensCollectionTokenValueLineHeight>,
    ): NumberFigmaDesignToken => {
      return isNumberTypographyDesignTokenValueLineHeight(value) || isCurlyReference(value)
        ? numberDesignTokensCollectionTokenToNumberFigmaDesignToken({
            ...token,
            type: 'number',
            value,
          })
        : dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
            ...token,
            type: 'dimension',
            value,
          });
    },
  });
}
