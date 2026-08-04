import { fontFaceFontWeightAbsoluteRangeSchema } from './font-face.font-weight.schema.ts';
import type {
  FontFaceFontWeight,
  FontFaceFontWeightAbsoluteRange,
} from './font-face.font-weight.ts';

export function isFontFaceFontWeightAbsoluteRange(
  input: FontFaceFontWeight,
): input is FontFaceFontWeightAbsoluteRange {
  return fontFaceFontWeightAbsoluteRangeSchema.safeParse(input).success;
}
