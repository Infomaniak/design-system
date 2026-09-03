import * as z from 'zod';

export const fontStyleSchema = z.enum(['normal', 'italic', 'oblique']);
