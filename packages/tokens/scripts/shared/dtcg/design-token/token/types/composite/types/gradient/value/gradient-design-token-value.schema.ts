import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { objectGradientDesignTokenValueSchema } from './members/object/object-gradient-design-token-value.schema.ts';

export const gradientDesignTokenValueSchema = z.array(
  valueOrDesignTokenReferenceSchema(objectGradientDesignTokenValueSchema),
);
