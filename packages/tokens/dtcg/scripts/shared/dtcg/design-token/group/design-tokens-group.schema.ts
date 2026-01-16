import * as z from 'zod';
import { curlyReferenceSchema } from '../reference/types/curly/curly-reference.schema.ts';
import { jsonReferenceSchema } from '../reference/types/json/json-reference.schema.ts';
import { designTokensTreeSchema } from '../tree/design-tokens-tree.schema.ts';

export const designTokensGroupSchema = z
  .object({
    $description: z.string().optional(),
    $type: z.string().optional(),
    $extends: curlyReferenceSchema.optional(),
    $ref: jsonReferenceSchema.optional(),
    $deprecated: z.union([z.boolean(), z.string()]).optional(),
    $extensions: z.looseObject({}).optional(),
  })
  .catchall(z.lazy<any>(() => designTokensTreeSchema));
