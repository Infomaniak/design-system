import * as z from 'zod';
import { fontVariantSchema } from './font-variant/font-variant.schema.ts';

export const fontDescriptionSchema = z.strictObject({
  family: z.string(),
  variants: z.array(fontVariantSchema),
});
