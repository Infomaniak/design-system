import * as z from 'zod';

export const packageJsonSchema = z
  .object({
    name: z.string().nonempty(),
    version: z.string().nonempty(),
    scripts: z.record(z.string(), z.string()).optional(),
    dependencies: z.record(z.string(), z.string()).optional(),
  })
  .catchall(z.unknown());
