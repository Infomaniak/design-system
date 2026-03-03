import * as z from 'zod';

export const publishModeSchema = z.enum(['dev', 'rc', 'prod']);
