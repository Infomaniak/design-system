import * as z from 'zod';

export const numberFontWeightDesignTokenValueSchema = z.number().min(0).max(1000);
