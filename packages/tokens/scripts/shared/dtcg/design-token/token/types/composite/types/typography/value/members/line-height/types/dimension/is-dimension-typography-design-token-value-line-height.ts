import { dimensionTypographyDesignTokenValueLineHeightSchema } from './dimension-typography-design-token-value-line-height.schema.ts';
import type { DimensionTypographyDesignTokenValueLineHeight } from './dimension-typography-design-token-value-line-height.ts';

/**
 * @deprecated UNOFICIAL: use with caution
 */
export function isDimensionTypographyDesignTokenValueLineHeight(
  input: unknown,
): input is DimensionTypographyDesignTokenValueLineHeight {
  return dimensionTypographyDesignTokenValueLineHeightSchema.safeParse(input).success;
}
