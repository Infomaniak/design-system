import * as z from 'zod';

export const genericDesignTokenSchema = z.object({
  $value: z.custom<unknown>((x: unknown) => x !== undefined, '$value should be defined.'),
  $type: z.string().optional(),
  $deprecated: z.union([z.boolean(), z.string()]).optional(),
  $description: z.string().optional(),
  $extensions: z.looseObject({}).optional(),
});
