import * as z from 'zod';
import { dimensionTypographyDesignTokenValueLineHeightSchema } from './types/dimension/dimension-typography-design-token-value-line-height.schema.ts';
import { numberTypographyDesignTokenValueLineHeightSchema } from './types/number/number-typography-design-token-value-line-height.schema.ts';

export const typographyDesignTokenValueLineHeightSchema = z.union([
  numberTypographyDesignTokenValueLineHeightSchema,
  dimensionTypographyDesignTokenValueLineHeightSchema /* NOTE: UNOFFICIAL */,
]);
