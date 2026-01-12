import * as z from 'zod';
import { baseDesignTokenSchema } from '../base/base-design-token.schema.ts';
import { compositeDesignTokenSchema } from '../composite/composite-design-token.schema.ts';

export const unknownDesignTokenSchema = z.union([
  baseDesignTokenSchema,
  compositeDesignTokenSchema,
]);
