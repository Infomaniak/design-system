import * as z from 'zod';
import { fontWeightStaticSchema } from '../static/font-weight-static.schema.ts';
import type { FontWeightRange } from './font-weight-range.ts';

export const fontWeightRangeSchema = z
  .tuple([fontWeightStaticSchema, fontWeightStaticSchema])
  .refine(([start, end]: FontWeightRange): boolean => start <= end, {
    message: 'Font weight range start must not exceed end',
  });
