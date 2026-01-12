import * as z from 'zod';

export const curlyReferenceSchema = z.string().regex(/^\{.*\}$/);
