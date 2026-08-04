import { fontFaceFontWeightAbsoluteSchema } from './font-face.font-weight.schema.ts';
import type { FontFaceFontWeight, FontFaceFontWeightAbsolute } from './font-face.font-weight.ts';

export function isFontFaceFontWeightAbsolute(
  input: FontFaceFontWeight,
): input is FontFaceFontWeightAbsolute {
  return fontFaceFontWeightAbsoluteSchema.safeParse(input).success;
}
