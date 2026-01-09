import { registerDtcgColorCssStyleDictionaryTransform } from './base/color.ts';
import { registerDtcgCubicBezierCssStyleDictionaryTransform } from './base/cubic-bezier.ts';
import { registerDtcgDimensionCssStyleDictionaryTransform } from './base/dimension.ts';
import { registerDtcgDurationCssStyleDictionaryTransform } from './base/duration.ts';
import { registerDtcgFontFamilyCssStyleDictionaryTransform } from './base/font-family.ts';
import { registerDtcgFontWeightCssStyleDictionaryTransform } from './base/font-weight.ts';
import { registerDtcgNumberCssStyleDictionaryTransform } from './base/number.ts';
import { registerDtcgBorderCssStyleDictionaryTransform } from './composite/border.ts';
import { registerDtcgStrokeStyleCssStyleDictionaryTransform } from './composite/stroke-style.ts';
import { registerDtcgTransitionCssStyleDictionaryTransform } from './composite/transition.ts';
import { registerDtcgTypographyCssStyleDictionaryTransform } from './composite/typography.ts';

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
