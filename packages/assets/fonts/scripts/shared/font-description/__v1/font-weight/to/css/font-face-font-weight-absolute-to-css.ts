import type { FontFaceFontWeightAbsolute } from '../../font-face.font-weight.ts';

export function fontFaceFontWeightAbsoluteToCss(input: FontFaceFontWeightAbsolute): string {
  return typeof input === 'number' ? input.toString(10) : input;
}
