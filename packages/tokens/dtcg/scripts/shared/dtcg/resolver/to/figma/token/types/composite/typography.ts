import type { ResolvedDesignTokensCollectionToken } from '../../../../../token/design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import { dimensionDesignTokensCollectionTokenToFigmaObject } from '../base/dimension.ts';
import { fontFamilyDesignTokensCollectionTokenToFigmaObject } from '../base/font-family.ts';
import { fontWeightDesignTokensCollectionTokenToFigmaObject } from '../base/font-weight.ts';
import { numberDesignTokensCollectionTokenToFigmaObject } from '../base/number.ts';

export function typographyDesignTokensCollectionTokenToFigmaObject(
  token: ResolvedDesignTokensCollectionToken<
    'typography',
    TypographyDesignTokensCollectionTokenValue
  >,
): unknown {
  return {
    fontFamily: fontFamilyDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'fontFamily',
      value: token.value.fontFamily,
    }),
    fontSize: dimensionDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'dimension',
      value: token.value.fontSize,
    }),
    fontWeight: fontWeightDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'fontWeight',
      value: token.value.fontWeight,
    }),
    letterSpacing: dimensionDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'dimension',
      value: token.value.letterSpacing,
    }),
    lineHeight: numberDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'number',
      value: token.value.lineHeight,
    }),
  };
}
