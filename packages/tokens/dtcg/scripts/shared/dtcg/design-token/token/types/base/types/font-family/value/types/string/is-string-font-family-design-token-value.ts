import { stringFontFamilyDesignTokenValueSchema } from './string-font-family-design-token-value.schema.ts';
import type { StringFontFamilyDesignTokenValue } from './string-font-family-design-token-value.ts';

export function isStringFontFamilyDesignTokenValue(
  input: unknown,
): input is StringFontFamilyDesignTokenValue {
  return stringFontFamilyDesignTokenValueSchema.safeParse(input).success;
}
