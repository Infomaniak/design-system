import * as z from 'zod';
import { publishModeSchema } from '../publish-mode/publish-mode.schema.ts';

/**
 * @deprecated
 */
export const publishConfigSchema = z.object({
  mode: publishModeSchema,
});
