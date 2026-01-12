import * as z from 'zod';
import { objectArrayShadowDesignTokenValueSchema } from './types/object-array/object-array-shadow-design-token-value.schema.ts';
import { objectShadowDesignTokenValueSchema } from './types/object/object-shadow-design-token-value.schema.ts';

export const shadowDesignTokenValueSchema = z.union([
  objectShadowDesignTokenValueSchema,
  objectArrayShadowDesignTokenValueSchema,
]);
