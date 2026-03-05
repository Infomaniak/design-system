import * as z from 'zod';
import { packageJsonDependenciesSchema } from './package-json-dependencies/package-json-dependencies.schema.ts';

export const packageJsonSchema = z
  .object({
    name: z.string().nonempty(),
    version: z.string().nonempty(),
    type: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
    keywords: z.array(z.string().nonempty()).optional(),
    author: z.string().nonempty().optional(),
    license: z.string().nonempty().optional(),
    repository: z.unknown().optional(),
    scripts: z.record(z.string(), z.string()).optional(),
    dependencies: packageJsonDependenciesSchema.optional(),
    devDependencies: packageJsonDependenciesSchema.optional(),
    peerDependencies: packageJsonDependenciesSchema.optional(),
    optionalDependencies: packageJsonDependenciesSchema.optional(),
  })
  .catchall(z.unknown());
