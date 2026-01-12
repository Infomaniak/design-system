import * as z from 'zod';

export const genericDesignTokenSchema = z.object({
  $value: z.any(),
  $type: z.string().optional(),
  $deprecated: z.union([z.boolean(), z.string()]).optional(),
  $description: z.string().optional(),
  $extensions: z.looseObject({}).optional(),
});
