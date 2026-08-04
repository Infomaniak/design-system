import * as z from 'zod';

export const fontFaceFontDisplaySchema = z.enum(['auto', 'block', 'swap', 'fallback', 'optional']);
