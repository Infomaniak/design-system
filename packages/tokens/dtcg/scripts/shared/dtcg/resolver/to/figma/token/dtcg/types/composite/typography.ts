import type { ResolvedDesignTokensCollectionToken } from '../../../../../../token/design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
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
    lineHeight: numberDesignTokensCollectionTokenToNumberFigmaDesignToken({
      ...token,
      type: 'number',
      value: token.value.lineHeight,
    }),
  };
}
