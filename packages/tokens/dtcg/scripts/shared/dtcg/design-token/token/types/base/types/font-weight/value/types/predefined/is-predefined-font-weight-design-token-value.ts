import { predefinedFontWeightDesignTokenValueSchema } from './predefined-font-weight-design-token-value.schema.ts';
import type { PredefinedFontWeightDesignTokenValue } from './predefined-font-weight-design-token-value.ts';

export function isPredefinedFontWeightDesignTokenValue(
  input: unknown,
): input is PredefinedFontWeightDesignTokenValue {
  return predefinedFontWeightDesignTokenValueSchema.safeParse(input).success;
}
