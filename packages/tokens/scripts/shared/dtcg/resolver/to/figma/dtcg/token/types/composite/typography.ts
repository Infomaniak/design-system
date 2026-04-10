import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { isNumberTypographyDesignTokenValueLineHeight } from '../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/number/is-number-typography-design-token-value-line-height.ts';
import type { ResolvedDesignTokensCollectionToken } from '../../../../../../token/design-tokens-collection-token.ts';
import type { DimensionTypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../token/types/composite/typography/value/members/line-height/types/dimension/dimension-typography-design-tokens-collection-token-value-line-height.ts';
import type { NumberTypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../token/types/composite/typography/value/members/line-height/types/number/number-typography-design-tokens-collection-token-value-line-height.ts';
import type { TypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../token/types/composite/typography/value/members/line-height/typography-design-tokens-collection-token-value-line-height.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/dimension.ts';
import { fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken } from '../base/font-family.ts';
import { fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/font-weight.ts';
import { numberDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/number.ts';

export function typographyDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: ResolvedDesignTokensCollectionToken<
    'typography',
    TypographyDesignTokensCollectionTokenValue
  >,
): FigmaDesignTokensGroup {
  return {
    fontFamily: fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken({
      ...token,
      type: 'fontFamily',
      value: token.value.fontFamily,
    }),
    fontSize: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
      ...token,
      type: 'dimension',
      value: token.value.fontSize,
    }),
    fontWeight: fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken({
      ...token,
      type: 'fontWeight',
      value: token.value.fontWeight,
    }),
    letterSpacing: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
      ...token,
      type: 'dimension',
      value: token.value.letterSpacing,
    }),
    lineHeight: typographyDesignTokensCollectionTokenValueLineHeightToFigmaValue(token),
  };
}

export function typographyDesignTokensCollectionTokenValueLineHeightToFigmaValue(
  token: ResolvedDesignTokensCollectionToken<
    'typography',
    TypographyDesignTokensCollectionTokenValue
  >,
): NumberFigmaDesignToken {
  const value: ValueOrCurlyReference<TypographyDesignTokensCollectionTokenValueLineHeight> =
    token.value.lineHeight;
  return isNumberTypographyDesignTokenValueLineHeight(value) || isCurlyReference(value)
    ? numberDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'number',
        value: token.value
          .lineHeight as ValueOrCurlyReference<NumberTypographyDesignTokensCollectionTokenValueLineHeight>,
      })
    : dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'dimension',
        value: token.value
          .lineHeight as ValueOrCurlyReference<DimensionTypographyDesignTokensCollectionTokenValueLineHeight>,
      });
}
