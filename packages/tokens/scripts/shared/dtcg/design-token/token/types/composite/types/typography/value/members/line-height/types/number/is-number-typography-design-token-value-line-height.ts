import { numberTypographyDesignTokenValueLineHeightSchema } from './number-typography-design-token-value-line-height.schema.ts';
import type { NumberTypographyDesignTokenValueLineHeight } from './number-typography-design-token-value-line-height.ts';

export function isNumberTypographyDesignTokenValueLineHeight(
  input: unknown,
): input is NumberTypographyDesignTokenValueLineHeight {
  return numberTypographyDesignTokenValueLineHeightSchema.safeParse(input).success;
}
