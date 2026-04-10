import type { DimensionTypographyDesignTokenValueLineHeight } from './types/dimension/dimension-typography-design-token-value-line-height.ts';
import type { NumberTypographyDesignTokenValueLineHeight } from './types/number/number-typography-design-token-value-line-height.ts';

export type TypographyDesignTokenValueLineHeight =
  | NumberTypographyDesignTokenValueLineHeight
  | DimensionTypographyDesignTokenValueLineHeight /* NOTE: UNOFFICIAL */;
