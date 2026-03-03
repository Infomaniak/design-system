import * as z from 'zod';
import { buildModeSchema } from '../build-mode/build-mode.schema.ts';

export const buildConfigSchema = z.object({
  mode: buildModeSchema,
  prerelease: z.string().optional(),
});
