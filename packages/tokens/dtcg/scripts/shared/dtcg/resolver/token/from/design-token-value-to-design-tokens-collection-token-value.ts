import type { ColorDesignTokenValue } from '../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { CubicBezierDesignTokenValue } from '../../../design-token/token/types/base/types/cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { DimensionDesignTokenValue } from '../../../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { DurationDesignTokenValue } from '../../../design-token/token/types/base/types/duration/value/duration-design-token-value.ts';
import type { FontFamilyDesignTokenValue } from '../../../design-token/token/types/base/types/font-family/value/font-family-design-token-value.ts';
import type { FontWeightDesignTokenValue } from '../../../design-token/token/types/base/types/font-weight/value/font-weight-design-token-value.ts';
import type { NumberDesignTokenValue } from '../../../design-token/token/types/base/types/number/value/number-design-token-value.ts';
import type { BorderDesignTokenValue } from '../../../design-token/token/types/composite/types/border/value/border-design-token-value.ts';
import type { GradientDesignTokenValue } from '../../../design-token/token/types/composite/types/gradient/value/gradient-design-token-value.ts';
import type { ShadowDesignTokenValue } from '../../../design-token/token/types/composite/types/shadow/value/shadow-design-token-value.ts';
import type { StrokeStyleDesignTokenValue } from '../../../design-token/token/types/composite/types/stroke-style/value/stroke-style-design-token-value.ts';
import type { TransitionDesignTokenValue } from '../../../design-token/token/types/composite/types/transition/value/transition-design-token-value.ts';
import type { TypographyDesignTokenValue } from '../../../design-token/token/types/composite/types/typography/value/typography-design-token-value.ts';
import { colorDesignTokenValueToColorDesignTokensCollectionTokenValue } from '../types/base/color/value/from/color-design-token-value-to-color-design-tokens-collection-token-value.ts';
import { cubicBezierDesignTokenValueToCubicBezierDesignTokensCollectionTokenValue } from '../types/base/cubic-bezier/value/from/cubic-bezier-design-token-value-to-cubic-bezier-design-tokens-collection-token-value.ts';
import { dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue } from '../types/base/dimension/value/from/dimension-design-token-value-to-dimension-design-tokens-collection-token-value.ts';
import { durationDesignTokenValueToDurationDesignTokensCollectionTokenValue } from '../types/base/duration/value/from/duration-design-token-value-to-duration-design-tokens-collection-token-value.ts';
import { fontFamilyDesignTokenValueToFontFamilyDesignTokensCollectionTokenValue } from '../types/base/font-family/value/from/font-family-design-token-value-to-font-family-design-tokens-collection-token-value.ts';
import { fontWeightDesignTokenValueToFontWeightDesignTokensCollectionTokenValue } from '../types/base/font-weight/value/from/font-weight-design-token-value-to-font-weight-design-tokens-collection-token-value.ts';
import { numberDesignTokenValueToNumberDesignTokensCollectionTokenValue } from '../types/base/number/value/from/number-design-token-value-to-number-design-tokens-collection-token-value.ts';
import { borderDesignTokenValueToBorderDesignTokensCollectionTokenValue } from '../types/composite/border/value/from/border-design-token-value-to-border-design-tokens-collection-token-value.ts';
import { gradientDesignTokenValueToGradientDesignTokensCollectionTokenValue } from '../types/composite/gradient/value/from/gradient-design-token-value-to-gradient-design-tokens-collection-token-value.ts';
import { shadowDesignTokenValueToShadowDesignTokensCollectionTokenValue } from '../types/composite/shadow/value/from/shadow-design-token-value-to-shadow-design-tokens-collection-token-value.ts';
import { strokeStyleDesignTokenValueToStrokeStyleDesignTokensCollectionTokenValue } from '../types/composite/stroke-style/value/from/stroke-style-design-token-value-to-stroke-style-design-tokens-collection-token-value.ts';
import { transitionDesignTokenValueToTransitionDesignTokensCollectionTokenValue } from '../types/composite/transition/value/from/transition-design-token-value-to-transition-design-tokens-collection-token-value.ts';
import { typographyDesignTokenValueToTypographyDesignTokensCollectionTokenValue } from '../types/composite/typography/value/from/typography-design-token-value-to-typography-design-tokens-collection-token-value.ts';

export function designTokenValueToDesignTokensCollectionTokenValue(
  $type: string,
  $value: unknown,
  root: unknown,
): unknown {
  switch ($type) {
    case 'color':
      return colorDesignTokenValueToColorDesignTokensCollectionTokenValue(
        $value as ColorDesignTokenValue,
        root,
      );
    case 'cubicBezier':
      return cubicBezierDesignTokenValueToCubicBezierDesignTokensCollectionTokenValue(
        $value as CubicBezierDesignTokenValue,
        root,
      );
    case 'dimension':
      return dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(
        $value as DimensionDesignTokenValue,
        root,
      );
    case 'duration':
      return durationDesignTokenValueToDurationDesignTokensCollectionTokenValue(
        $value as DurationDesignTokenValue,
        root,
      );
    case 'fontFamily':
      return fontFamilyDesignTokenValueToFontFamilyDesignTokensCollectionTokenValue(
        $value as FontFamilyDesignTokenValue,
        root,
      );
    case 'fontWeight':
      return fontWeightDesignTokenValueToFontWeightDesignTokensCollectionTokenValue(
        $value as FontWeightDesignTokenValue,
        root,
      );
    case 'number':
      return numberDesignTokenValueToNumberDesignTokensCollectionTokenValue(
        $value as NumberDesignTokenValue,
        root,
      );

    case 'border':
      return borderDesignTokenValueToBorderDesignTokensCollectionTokenValue(
        $value as BorderDesignTokenValue,
        root,
      );
    case 'gradient':
      return gradientDesignTokenValueToGradientDesignTokensCollectionTokenValue(
        $value as GradientDesignTokenValue,
        root,
      );
    case 'shadow':
      return shadowDesignTokenValueToShadowDesignTokensCollectionTokenValue(
        $value as ShadowDesignTokenValue,
        root,
      );
    case 'strokeStyle':
      return strokeStyleDesignTokenValueToStrokeStyleDesignTokensCollectionTokenValue(
        $value as StrokeStyleDesignTokenValue,
        root,
      );
    case 'transition':
      return transitionDesignTokenValueToTransitionDesignTokensCollectionTokenValue(
        $value as TransitionDesignTokenValue,
        root,
      );
    case 'typography':
      return typographyDesignTokenValueToTypographyDesignTokensCollectionTokenValue(
        $value as TypographyDesignTokenValue,
        root,
      );
    default:
      console.warn(`Unknown token type: ${$type}.`);
      return $value;
  }
}
