import type { FontFaceFontWeight } from '../../font-face.font-weight.ts';
import { isFontFaceFontWeightAbsoluteRange } from '../../is-font-face-font-weight-absolute-range.ts';
import { isFontFaceFontWeightAbsolute } from '../../is-font-face-font-weight-absolute.ts';
import { fontFaceFontWeightAbsoluteRangeToCss } from './font-face-font-weight-absolute-range-to-css.ts';
import { fontFaceFontWeightAbsoluteToCss } from './font-face-font-weight-absolute-to-css.ts';

export function fontFaceFontWeightToCss(input: FontFaceFontWeight): string {
  if (isFontFaceFontWeightAbsolute(input)) {
    return fontFaceFontWeightAbsoluteToCss(input);
  } else if (isFontFaceFontWeightAbsoluteRange(input)) {
    return fontFaceFontWeightAbsoluteRangeToCss(input);
  } else {
    return input;
  }
}
