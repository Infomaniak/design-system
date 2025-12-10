import type { ColorBorderDesignTokenValueColor } from './types/color/color-border-design-token-value-color.ts';
import type { ReferenceBorderDesignTokenValueColor } from './types/reference/reference-border-design-token-value-color.ts';

export type BorderDesignTokenValueColor =
  | ColorBorderDesignTokenValueColor
  | ReferenceBorderDesignTokenValueColor;
