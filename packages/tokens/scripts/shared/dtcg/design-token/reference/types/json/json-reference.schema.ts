import * as z from 'zod';

export const jsonReferenceSchema = z.looseObject({
  // $ref: jsonPointerSchema,
  $ref: z.string(),
});
