import * as z from 'zod';

export const colorDesignTokenAlphaSchema = z.number().min(0).max(1).optional().default(1);
