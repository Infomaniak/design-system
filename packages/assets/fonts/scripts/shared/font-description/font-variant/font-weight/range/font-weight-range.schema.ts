import * as z from 'zod';
import { fontWeightStaticSchema } from '../static/font-weight-static.schema.ts';

export const fontWeightRangeSchema = z
  .tuple([fontWeightStaticSchema, fontWeightStaticSchema])
  .refine(([start, end]) => start <= end, {
    message: 'Font weight range start must not exceed end',
  });
