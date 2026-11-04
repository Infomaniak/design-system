import * as z from 'zod';

export const colorDesignTokenValueComponentSchema = z.union([z.number(), z.literal('none')]);
