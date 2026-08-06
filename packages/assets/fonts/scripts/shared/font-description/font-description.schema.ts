import * as z from 'zod';
import { fontVariantSchema } from './font-variant/font-variant.schema.ts';

export const fontDescriptionSchema = z.strictObject({
  family: z.string(),
  license: z.string().optional(),
  variants: z.array(fontVariantSchema),
});
