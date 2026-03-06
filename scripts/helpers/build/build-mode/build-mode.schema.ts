import * as z from 'zod';

export const buildModeSchema = z.enum(['dev', 'rc', 'prod']);
