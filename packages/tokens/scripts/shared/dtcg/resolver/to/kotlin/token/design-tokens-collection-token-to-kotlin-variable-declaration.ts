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
import type { KotlinVariableDeclaration } from '../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  colorDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type ColorDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/base/color/color-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  cubicBezierDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type CubicBezierDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/base/cubic-bezier/cubic-bezier-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  dimensionDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type DimensionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/base/dimension/dimension-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  durationDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type DurationDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/base/duration/duration-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  fontFamilyDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type FontFamilyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/base/font-family/font-family-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  fontWeightDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type FontWeightDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/base/font-weight/font-weight-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  numberDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type NumberDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/base/number/number-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  borderDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type BorderDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/composite/border/border-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  gradientDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type GradientDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/composite/gradient/gradient-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  shadowDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type ShadowDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/composite/shadow/shadow-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  strokeStyleDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type StrokeStyleDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/composite/stroke-style/stroke-style-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  transitionDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type TransitionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/composite/transition/transition-design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import {
  typographyDesignTokensCollectionTokenToKotlinVariableDeclaration,
  type TypographyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from './types/composite/typography/typography-design-tokens-collection-token-to-kotlin-variable-declaration.ts';

export interface DesignTokensCollectionTokenToKotlinVariableDeclarationOptions
  extends
    ColorDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    CubicBezierDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    DimensionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    DurationDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    FontFamilyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    FontWeightDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    NumberDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    BorderDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    GradientDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    ShadowDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    StrokeStyleDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    TransitionDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
    TypographyDesignTokensCollectionTokenToKotlinVariableDeclarationOptions {}

export function designTokensCollectionTokenToKotlinVariableDeclaration(
  token: GenericDesignTokensCollectionTokenWithType,
  options?: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  if (isColorDesignTokensCollectionToken(token)) {
    return colorDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isCubicBezierDesignTokensCollectionToken(token)) {
    return cubicBezierDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isDimensionDesignTokensCollectionToken(token)) {
    return dimensionDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isDurationDesignTokensCollectionToken(token)) {
    return durationDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isFontFamilyDesignTokensCollectionToken(token)) {
    return fontFamilyDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isFontWeightDesignTokensCollectionToken(token)) {
    return fontWeightDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isNumberDesignTokensCollectionToken(token)) {
    return numberDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
    //   // composite
  } else if (isBorderDesignTokensCollectionToken(token)) {
    return borderDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isGradientDesignTokensCollectionToken(token)) {
    return gradientDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isShadowDesignTokensCollectionToken(token)) {
    return shadowDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isStrokeStyleDesignTokensCollectionToken(token)) {
    return strokeStyleDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isTransitionDesignTokensCollectionToken(token)) {
    return transitionDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else if (isTypographyDesignTokensCollectionToken(token)) {
    return typographyDesignTokensCollectionTokenToKotlinVariableDeclaration(token, options);
  } else {
    return {
      name: 'undefined',
      value: {
        type: 'ref',
        value: 'abc',
      },
    };
    // throw new Error(`Unsupported token type: ${token.type}.`);
  }
}
