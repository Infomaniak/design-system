import * as z from 'zod';
import { valueOrDesignTokenReferenceSchema } from '../../../../../../../../reference/value-or/value-or-design-token-reference.schema.ts';
import { objectShadowDesignTokenValueSchema } from '../object/object-shadow-design-token-value.schema.ts';

export const objectArrayShadowDesignTokenValueSchema = z.array(
  valueOrDesignTokenReferenceSchema(objectShadowDesignTokenValueSchema),
);
