import { stringArrayFontFamilyDesignTokenValueSchema } from './string-array-font-family-design-token-value.schema.ts';
import type { StringArrayFontFamilyDesignTokenValue } from './string-array-font-family-design-token-value.ts';

export function isStringArrayFontFamilyDesignTokenValue(
  input: unknown,
): input is StringArrayFontFamilyDesignTokenValue {
  return stringArrayFontFamilyDesignTokenValueSchema.safeParse(input).success;
}
