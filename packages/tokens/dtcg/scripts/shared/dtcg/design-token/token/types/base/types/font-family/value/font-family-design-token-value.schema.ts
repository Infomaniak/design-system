import * as z from 'zod';
import { stringArrayFontFamilyDesignTokenValueSchema } from './types/string-array/string-array-font-family-design-token-value.schema.ts';
import { stringFontFamilyDesignTokenValueSchema } from './types/string/string-font-family-design-token-value.schema.ts';

export const fontFamilyDesignTokenValueSchema = z.union([
  stringFontFamilyDesignTokenValueSchema,
  stringArrayFontFamilyDesignTokenValueSchema,
]);
