import type { GenericDesignTokensCollectionTokenWithType } from '../../../token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../token/types/base/color/is-color-design-tokens-collection-token.ts';
import { isCubicBezierDesignTokensCollectionToken } from '../../../token/types/base/cubic-bezier/is-cubic-bezier-design-tokens-collection-token.ts';
import { isDimensionDesignTokensCollectionToken } from '../../../token/types/base/dimension/is-dimension-design-tokens-collection-token.ts';
import { isDurationDesignTokensCollectionToken } from '../../../token/types/base/duration/is-duration-design-tokens-collection-token.ts';
import { isFontFamilyDesignTokensCollectionToken } from '../../../token/types/base/font-family/is-font-family-design-tokens-collection-token.ts';
import { isFontWeightDesignTokensCollectionToken } from '../../../token/types/base/font-weight/is-font-weight-design-tokens-collection-token.ts';
import { isNumberDesignTokensCollectionToken } from '../../../token/types/base/number/is-number-design-tokens-collection-token.ts';
import { isBorderDesignTokensCollectionToken } from '../../../token/types/composite/border/is-border-design-tokens-collection-token.ts';
import { isGradientDesignTokensCollectionToken } from '../../../token/types/composite/gradient/is-gradient-design-tokens-collection-token.ts';
import { isShadowDesignTokensCollectionToken } from '../../../token/types/composite/shadow/is-shadow-design-tokens-collection-token.ts';
import { isStrokeStyleDesignTokensCollectionToken } from '../../../token/types/composite/stroke-style/is-stroke-style-design-tokens-collection-token.ts';
import { isTransitionDesignTokensCollectionToken } from '../../../token/types/composite/transition/is-transition-design-tokens-collection-token.ts';
import { isTypographyDesignTokensCollectionToken } from '../../../token/types/composite/typography/is-typography-design-tokens-collection-token.ts';
import type { SwiftEnumDeclaration } from '../swift-enum-declaration/swift-enum-declaration.ts';
import { dimensionDesignTokensCollectionTokenToSwiftEnumDeclaration } from './types/base/dimension/dimension-design-tokens-collection-token-to-swift-enum-declaration.ts';
import { fontWeightDesignTokensCollectionTokenToSwiftEnumDeclaration } from './types/base/font-weight/font-weight-design-tokens-collection-token-to-swift-enum-declaration.ts';
import { numberDesignTokensCollectionTokenToSwiftEnumDeclaration } from './types/base/number/number-design-tokens-collection-token-to-swift-enum-declaration.ts';

export function designTokensCollectionTokenToSwiftEnumDeclaration(
  token: GenericDesignTokensCollectionTokenWithType,
): SwiftEnumDeclaration {
  if (isColorDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isCubicBezierDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isDimensionDesignTokensCollectionToken(token)) {
    return dimensionDesignTokensCollectionTokenToSwiftEnumDeclaration(token);
  } else if (isDurationDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isFontFamilyDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isFontWeightDesignTokensCollectionToken(token)) {
    return fontWeightDesignTokensCollectionTokenToSwiftEnumDeclaration(token);
  } else if (isNumberDesignTokensCollectionToken(token)) {
    return numberDesignTokensCollectionTokenToSwiftEnumDeclaration(token);
    // composite
  } else if (isBorderDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isGradientDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isShadowDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isTransitionDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else if (isTypographyDesignTokensCollectionToken(token)) {
    throw new Error('Not implemented.');
  } else {
    throw new Error(`Unsupported token type: ${token.type}.`);
  }
}
