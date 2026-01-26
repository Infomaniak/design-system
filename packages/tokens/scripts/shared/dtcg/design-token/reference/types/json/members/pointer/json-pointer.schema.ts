import * as z from 'zod';

export const jsonPointerSchema = z.string().regex(/^#($|\/.*$)/);
