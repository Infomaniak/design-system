import type { DimensionBorderDesignTokenValueWidth } from './types/dimension/dimension-border-design-token-value-width.ts';
import type { ReferenceBorderDesignTokenValueWidth } from './types/reference/reference-border-design-token-value-width.ts';

export type BorderDesignTokenValueWidth =
  | DimensionBorderDesignTokenValueWidth
  | ReferenceBorderDesignTokenValueWidth;
