import * as z from 'zod';

export const fontWeightStaticSchema = z.number().int().min(1).max(1000);
