import * as z from 'zod';

export const durationDesignTokenValueUnitSchema = z.enum(['ms', 's']);
