import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../reference/value-or/value-or-design-token-reference.schema.ts';
import { genericDesignTokenSchema } from './generic-design-token.schema.ts';

export function designTokenSchema<GType extends string, GValue extends z.core.SomeType>(
  $type: GType,
  value: GValue,
) {
  return z.object({
    ...genericDesignTokenSchema,
    $value: valueOrDesignTokenReferenceSchema(value),
    $type: z.literal($type).optional(),
  });
}
