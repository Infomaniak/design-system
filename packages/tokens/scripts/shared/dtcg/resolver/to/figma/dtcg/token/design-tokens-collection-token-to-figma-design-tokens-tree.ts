import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
  GenericResolvedDesignTokensCollectionToken,
} from '../../../../token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../token/types/base/color/is-color-design-tokens-collection-token.ts';
import { isCubicBezierDesignTokensCollectionToken } from '../../../../token/types/base/cubic-bezier/is-cubic-bezier-design-tokens-collection-token.ts';
import { isDimensionDesignTokensCollectionToken } from '../../../../token/types/base/dimension/is-dimension-design-tokens-collection-token.ts';
import { isDurationDesignTokensCollectionToken } from '../../../../token/types/base/duration/is-duration-design-tokens-collection-token.ts';
import { isFontFamilyDesignTokensCollectionToken } from '../../../../token/types/base/font-family/is-font-family-design-tokens-collection-token.ts';
import { isFontWeightDesignTokensCollectionToken } from '../../../../token/types/base/font-weight/is-font-weight-design-tokens-collection-token.ts';
import { isNumberDesignTokensCollectionToken } from '../../../../token/types/base/number/is-number-design-tokens-collection-token.ts';
import { isBorderDesignTokensCollectionToken } from '../../../../token/types/composite/border/is-border-design-tokens-collection-token.ts';
import { isGradientDesignTokensCollectionToken } from '../../../../token/types/composite/gradient/is-gradient-design-tokens-collection-token.ts';
import { isShadowDesignTokensCollectionToken } from '../../../../token/types/composite/shadow/is-shadow-design-tokens-collection-token.ts';
import { isStrokeStyleDesignTokensCollectionToken } from '../../../../token/types/composite/stroke-style/is-stroke-style-design-tokens-collection-token.ts';
import { isTransitionDesignTokensCollectionToken } from '../../../../token/types/composite/transition/is-transition-design-tokens-collection-token.ts';
import { isTypographyDesignTokensCollectionToken } from '../../../../token/types/composite/typography/is-typography-design-tokens-collection-token.ts';
import type { FigmaDesignTokensTree } from '../../figma/tree/figma-design-tokens-tree.ts';
import { colorDesignTokensCollectionTokenToColorFigmaDesignToken } from './types/base/color.ts';
import { cubicBezierDesignTokensCollectionTokenToCubicBezierFigmaDesignToken } from './types/base/cubic-bezier.ts';
import { dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken } from './types/base/dimension.ts';
import { durationDesignTokensCollectionTokenToNumberFigmaDesignToken } from './types/base/duration.ts';
import { fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken } from './types/base/font-family.ts';
import { fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken } from './types/base/font-weight.ts';
import { numberDesignTokensCollectionTokenToNumberFigmaDesignToken } from './types/base/number.ts';
import { borderDesignTokensCollectionTokenToFigmaDesignTokensGroup } from './types/composite/border.ts';
import { gradientDesignTokensCollectionTokenToFigmaDesignTokensGroup } from './types/composite/gradient.ts';
import { shadowDesignTokensCollectionTokenToFigmaDesignTokensGroup } from './types/composite/shadow.ts';
import { strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken } from './types/composite/stroke-style.ts';
import { transitionDesignTokensCollectionTokenToFigmaDesignTokensGroup } from './types/composite/transition.ts';
import { typographyDesignTokensCollectionTokenToFigmaDesignTokensGroup } from './types/composite/typography.ts';

export function designTokensCollectionTokenToFigmaDesignTokensTree(
  token: GenericDesignTokensCollectionToken,
  resolvedToken: GenericResolvedDesignTokensCollectionToken,
): FigmaDesignTokensTree {
  const tokenWithType: GenericDesignTokensCollectionTokenWithType = {
    type: resolvedToken.type,
    ...token,
  };

  if (isColorDesignTokensCollectionToken(tokenWithType)) {
    return colorDesignTokensCollectionTokenToColorFigmaDesignToken(tokenWithType);
  } else if (isCubicBezierDesignTokensCollectionToken(tokenWithType)) {
    return cubicBezierDesignTokensCollectionTokenToCubicBezierFigmaDesignToken(tokenWithType);
  } else if (isDimensionDesignTokensCollectionToken(tokenWithType)) {
    return dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(tokenWithType);
  } else if (isDurationDesignTokensCollectionToken(tokenWithType)) {
    return durationDesignTokensCollectionTokenToNumberFigmaDesignToken(tokenWithType);
  } else if (isFontFamilyDesignTokensCollectionToken(tokenWithType)) {
    return fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken(tokenWithType);
  } else if (isFontWeightDesignTokensCollectionToken(tokenWithType)) {
    return fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken(tokenWithType);
  } else if (isNumberDesignTokensCollectionToken(tokenWithType)) {
    return numberDesignTokensCollectionTokenToNumberFigmaDesignToken(tokenWithType);
    // composite
  } else if (isBorderDesignTokensCollectionToken(tokenWithType)) {
    return borderDesignTokensCollectionTokenToFigmaDesignTokensGroup(resolvedToken);
  } else if (isGradientDesignTokensCollectionToken(tokenWithType)) {
    return gradientDesignTokensCollectionTokenToFigmaDesignTokensGroup(resolvedToken);
  } else if (isShadowDesignTokensCollectionToken(tokenWithType)) {
    return shadowDesignTokensCollectionTokenToFigmaDesignTokensGroup(resolvedToken);
  } else if (isStrokeStyleDesignTokensCollectionToken(tokenWithType)) {
    return strokeStyleDesignTokensCollectionTokenToStringFigmaDesignToken(tokenWithType);
  } else if (isTransitionDesignTokensCollectionToken(tokenWithType)) {
    return transitionDesignTokensCollectionTokenToFigmaDesignTokensGroup(resolvedToken);
  } else if (isTypographyDesignTokensCollectionToken(tokenWithType)) {
    return typographyDesignTokensCollectionTokenToFigmaDesignTokensGroup(resolvedToken);
  } else {
    throw new Error(`Unsupported token type: ${token.type}.`);
  }
}
