import * as z from 'zod';
import { fontWeightRangeSchema } from './range/font-weight-range.schema.ts';
import { fontWeightStaticSchema } from './static/font-weight-static.schema.ts';

export const fontWeightSchema = z.union([fontWeightStaticSchema, fontWeightRangeSchema]);
