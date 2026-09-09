import * as z from 'zod';
import { fontOpticalSizingSchema } from './font-optical-sizing/font-optical-sizing.schema.ts';
import { fontStyleSchema } from './font-style/font-style.schema.ts';
import { fontWeightSchema } from './font-weight/font-weight.schema.ts';

export const fontVariantSchema = z.strictObject({
  src: z.string(),
  style: fontStyleSchema,
  weight: fontWeightSchema,
  opticalSizing: fontOpticalSizingSchema.optional(),
});
