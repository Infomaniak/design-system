import * as z from 'zod';
import { fontFaceFontDisplaySchema } from './font-display/font-face.font-display.schema.ts';
import { fontFaceFontStyleSchema } from './font-style/font-face.font-style.schema.ts';
import { fontFaceFontWeightSchema } from './font-weight/font-face.font-weight.schema.ts';

export const fontFaceSchema = z.strictObject({
  fontDisplay: fontFaceFontDisplaySchema.optional(),
  fontFamily: z.string(),
  fontStyle: fontFaceFontStyleSchema.optional(),
  fontWeight: fontFaceFontWeightSchema.optional(),
  src: z.string().optional(),
});
