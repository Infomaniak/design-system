import * as z from 'zod';

/**
 * @deprecated
 */
export const publishModeSchema = z.enum(['dev', 'rc', 'prod']);
