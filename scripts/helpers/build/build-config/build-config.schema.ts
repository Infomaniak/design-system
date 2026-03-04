import * as z from 'zod';
import { packageJsonDependenciesSchema } from '../../file/package-json/package-json-dependencies/package-json-dependencies.schema.ts';
import { buildModeSchema } from '../build-mode/build-mode.schema.ts';

export const buildConfigSchema = z.object({
  mode: buildModeSchema,
  prerelease: z.string().optional(),
  dependenciesOverride: packageJsonDependenciesSchema.optional(),
});
