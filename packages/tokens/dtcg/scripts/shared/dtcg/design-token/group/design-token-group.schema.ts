import * as z from 'zod';
import { curlyReferenceSchema } from '../reference/types/curly/curly-reference.schema.ts';
import { jsonReferenceSchema } from '../reference/types/json/json-reference.schema.ts';
import { genericDesignTokenSchema } from '../token/generic-design-token.schema.ts';

export const designTokenGroupSchema = z
  .looseObject({
    $description: z.string().optional(),
    $type: z.string().optional(),
    $extends: curlyReferenceSchema.optional(),
    $ref: jsonReferenceSchema.optional(),
    $deprecated: z.union([z.boolean(), z.string()]).optional(),
    $extensions: z.looseObject({}).optional(),
  })
  .catchall(genericDesignTokenSchema);
