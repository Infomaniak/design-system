import { numberFontWeightDesignTokenValueSchema } from './number-font-weight-design-token-value.schema.ts';
import type { NumberFontWeightDesignTokenValue } from './number-font-weight-design-token-value.ts';

export function isNumberFontWeightDesignTokenValue(
  input: unknown,
): input is NumberFontWeightDesignTokenValue {
  return numberFontWeightDesignTokenValueSchema.safeParse(input).success;
}
