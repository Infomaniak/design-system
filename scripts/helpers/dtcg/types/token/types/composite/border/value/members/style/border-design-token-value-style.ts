import type { ReferenceBorderDesignTokenValueStyle } from './types/reference/reference-border-design-token-value-style.ts';
import type { StrokeStyleBorderDesignTokenValueStyle } from './types/stroke-style/stroke-style-border-design-token-value-style.ts';

export type BorderDesignTokenValueStyle =
  | StrokeStyleBorderDesignTokenValueStyle
  | ReferenceBorderDesignTokenValueStyle;
