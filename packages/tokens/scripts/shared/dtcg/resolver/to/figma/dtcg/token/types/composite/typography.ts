import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { isNumberTypographyDesignTokenValueLineHeight } from '../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/number/is-number-typography-design-token-value-line-height.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionToken } from '../../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionToken } from '../../../../../../token/types/composite/typography/typography-design-tokens-collection-token.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';

import { generateCompositeDesignTokensCollectionSubToken } from '../../generate-composite-design-tokens-collection-sub-token.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/dimension.ts';
import { fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken } from '../base/font-family.ts';
import { fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/font-weight.ts';
import { numberDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/number.ts';

export function typographyDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: TypographyDesignTokensCollectionToken,
): FigmaDesignTokensGroup {
  return {
    fontFamily: fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'fontFamily', 'fontFamily'),
    ),
    fontSize: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'fontSize', 'dimension'),
    ),
    fontWeight: fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'fontWeight', 'fontWeight'),
    ),
    letterSpacing: dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'letterSpacing', 'dimension'),
    ),
    lineHeight:
      isCurlyReference(token.value) ||
      isNumberTypographyDesignTokenValueLineHeight(token.value.lineHeight)
        ? numberDesignTokensCollectionTokenToNumberFigmaDesignToken(
            generateCompositeDesignTokensCollectionSubToken(
              token,
              'lineHeight',
              'number',
            ) as NumberDesignTokensCollectionToken,
          )
        : dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
            generateCompositeDesignTokensCollectionSubToken(
              token,
              'lineHeight',
              'dimension',
            ) as DimensionDesignTokensCollectionToken,
          ),
  };
}
