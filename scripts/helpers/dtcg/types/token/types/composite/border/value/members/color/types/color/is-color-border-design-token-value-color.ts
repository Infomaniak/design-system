import type { BorderDesignTokenValueColor } from '../../border-design-token-value-color.ts';
import type { ColorBorderDesignTokenValueColor } from './color-border-design-token-value-color.ts';

export function isColorBorderDesignTokenValueColor(
  input: BorderDesignTokenValueColor,
): input is ColorBorderDesignTokenValueColor {
  return typeof input === 'object' && input !== null;
}
