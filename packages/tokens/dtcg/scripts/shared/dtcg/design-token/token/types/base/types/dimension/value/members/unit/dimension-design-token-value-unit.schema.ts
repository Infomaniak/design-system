import * as z from 'zod';

export const dimensionDesignTokenValueUnitSchema = z.enum(['px', 'rem']);
