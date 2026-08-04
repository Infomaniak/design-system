import type { FontFaceFontWeightAbsoluteRange } from '../../font-face.font-weight.ts';
import { fontFaceFontWeightAbsoluteToCss } from './font-face-font-weight-absolute-to-css.ts';

export function fontFaceFontWeightAbsoluteRangeToCss([
  a,
  b,
]: FontFaceFontWeightAbsoluteRange): string {
  return `${fontFaceFontWeightAbsoluteToCss(a)} ${fontFaceFontWeightAbsoluteToCss(b)}`;
}
