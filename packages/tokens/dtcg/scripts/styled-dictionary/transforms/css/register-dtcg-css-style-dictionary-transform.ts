import { registerDtcgColorCssStyleDictionaryTransform } from './tokens/base/color.ts';
import { registerDtcgCubicBezierCssStyleDictionaryTransform } from './tokens/base/cubic-bezier.ts';
import { registerDtcgDimensionCssStyleDictionaryTransform } from './tokens/base/dimension.ts';
import { registerDtcgDurationCssStyleDictionaryTransform } from './tokens/base/duration.ts';
import { registerDtcgFontFamilyCssStyleDictionaryTransform } from './tokens/base/font-family.ts';
import { registerDtcgFontWeightCssStyleDictionaryTransform } from './tokens/base/font-weight.ts';
import { registerDtcgNumberCssStyleDictionaryTransform } from './tokens/base/number.ts';
import { registerDtcgBorderCssStyleDictionaryTransform } from './tokens/composite/border.ts';
import { registerDtcgStrokeStyleCssStyleDictionaryTransform } from './tokens/composite/stroke-style.ts';
import { registerDtcgTransitionCssStyleDictionaryTransform } from './tokens/composite/transition.ts';
import { registerDtcgTypographyCssStyleDictionaryTransform } from './tokens/composite/typography.ts';

export function registerDtcgCssStyleDictionaryTransform(): void {
  // base
  registerDtcgColorCssStyleDictionaryTransform();
  registerDtcgDimensionCssStyleDictionaryTransform();
  registerDtcgFontFamilyCssStyleDictionaryTransform();
  registerDtcgFontWeightCssStyleDictionaryTransform();
  registerDtcgDurationCssStyleDictionaryTransform();
  registerDtcgCubicBezierCssStyleDictionaryTransform();
  registerDtcgNumberCssStyleDictionaryTransform();

  // composite
  registerDtcgBorderCssStyleDictionaryTransform();
  registerDtcgTransitionCssStyleDictionaryTransform();
  registerDtcgStrokeStyleCssStyleDictionaryTransform();
  registerDtcgTypographyCssStyleDictionaryTransform();
}
