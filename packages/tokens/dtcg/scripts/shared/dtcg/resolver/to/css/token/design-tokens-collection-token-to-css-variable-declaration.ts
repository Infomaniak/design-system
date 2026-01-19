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
import type { CssVariableDeclaration } from '../css-variable-declaration.ts';
import {
  colorDesignTokensCollectionTokenToCssVariableDeclaration,
  type ColorDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/base/color/color-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  cubicBezierDesignTokensCollectionTokenToCssVariableDeclaration,
  type CubicBezierDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/base/cubic-bezier/cubic-bezier-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  dimensionDesignTokensCollectionTokenToCssVariableDeclaration,
  type DimensionDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/base/dimension/dimension-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  durationDesignTokensCollectionTokenToCssVariableDeclaration,
  type DurationDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/base/duration/duration-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  fontFamilyDesignTokensCollectionTokenToCssVariableDeclaration,
  type FontFamilyDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/base/font-family/font-family-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  fontWeightDesignTokensCollectionTokenToCssVariableDeclaration,
  type FontWeightDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/base/font-weight/font-weight-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  numberDesignTokensCollectionTokenToCssVariableDeclaration,
  type NumberDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/base/number/number-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  borderDesignTokensCollectionTokenToCssVariableDeclaration,
  type BorderDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/composite/border/border-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  gradientDesignTokensCollectionTokenToCssVariableDeclaration,
  type GradientDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/composite/gradient/gradient-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  shadowDesignTokensCollectionTokenToCssVariableDeclaration,
  type ShadowDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/composite/shadow/shadow-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  strokeStyleDesignTokensCollectionTokenToCssVariableDeclaration,
  type StrokeStyleDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/composite/stroke-style/stroke-style-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  transitionDesignTokensCollectionTokenToCssVariableDeclaration,
  type TransitionDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/composite/transition/transition-design-tokens-collection-token-to-css-variable-declaration.ts';
import {
  typographyDesignTokensCollectionTokenToCssVariableDeclaration,
  type TypographyDesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from './types/composite/typography/typography-design-tokens-collection-token-to-css-variable-declaration.ts';

export interface DesignTokensCollectionTokenToCssVariableDeclarationOptions
  extends
    ColorDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    CubicBezierDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    DimensionDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    DurationDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    FontFamilyDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    FontWeightDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    NumberDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    BorderDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    GradientDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    ShadowDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    StrokeStyleDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    TransitionDesignTokensCollectionTokenToCssVariableDeclarationOptions,
    TypographyDesignTokensCollectionTokenToCssVariableDeclarationOptions {}

export function designTokensCollectionTokenToCssVariableDeclaration(
  token: GenericDesignTokensCollectionTokenWithType,
  options?: DesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  if (isColorDesignTokensCollectionToken(token)) {
    return colorDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isCubicBezierDesignTokensCollectionToken(token)) {
    return cubicBezierDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isDimensionDesignTokensCollectionToken(token)) {
    return dimensionDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isDurationDesignTokensCollectionToken(token)) {
    return durationDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isFontFamilyDesignTokensCollectionToken(token)) {
    return fontFamilyDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isFontWeightDesignTokensCollectionToken(token)) {
    return fontWeightDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isNumberDesignTokensCollectionToken(token)) {
    return numberDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
    // composite
  } else if (isBorderDesignTokensCollectionToken(token)) {
    return borderDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isGradientDesignTokensCollectionToken(token)) {
    return gradientDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isShadowDesignTokensCollectionToken(token)) {
    return shadowDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
    return strokeStyleDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isTransitionDesignTokensCollectionToken(token)) {
    return transitionDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else if (isTypographyDesignTokensCollectionToken(token)) {
    return typographyDesignTokensCollectionTokenToCssVariableDeclaration(token, options);
  } else {
    throw new Error(`Unsupported token type: ${token.type}.`);
  }
}
