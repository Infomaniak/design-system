import * as z from 'zod';
import { fontWeightStaticSchema } from '../static/font-weight-static.schema.ts';

export const fontWeightRangeSchema = z.tuple([fontWeightStaticSchema, fontWeightStaticSchema]);
