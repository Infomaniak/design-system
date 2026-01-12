import * as z from 'zod';
import { numberFontWeightDesignTokenValueSchema } from './types/number/number-font-weight-design-token-value.schema.ts';
import { predefinedFontWeightDesignTokenValueSchema } from './types/predefined/predefined-font-weight-design-token-value.schema.ts';

export const fontWeightDesignTokenValueSchema = z.union([
  numberFontWeightDesignTokenValueSchema,
  predefinedFontWeightDesignTokenValueSchema,
]);
