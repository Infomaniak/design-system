import * as z from 'zod';
import { objectStrokeStyleDesignTokenValueSchema } from './types/object/object-stroke-style-design-token-value.schema.ts';
import { predefinedStrokeStyleDesignTokenValueSchema } from './types/predefined/predefined-stroke-style-design-token-value.schema.ts';

export const strokeStyleDesignTokenValueSchema = z.union([
  objectStrokeStyleDesignTokenValueSchema,
  predefinedStrokeStyleDesignTokenValueSchema,
]);
