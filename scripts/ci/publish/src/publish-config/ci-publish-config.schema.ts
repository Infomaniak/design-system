import * as z from 'zod';

export const ciPublishConfigSchema = z.object({
  targetBranch: z.string().nonempty(),
  prLabels: z.array(z.string().nonempty()),
});
