import type { ColorFigmaDesignTokenObjectValue } from './types/object/color-figma-design-token-object-value.ts';
import type { ColorFigmaDesignTokenStringValue } from './types/string/color-figma-design-token-string-value.ts';

export type ColorFigmaDesignTokenValue =
  ColorFigmaDesignTokenStringValue | ColorFigmaDesignTokenObjectValue;
