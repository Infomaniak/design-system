import type { ColorFigmaDesignTokenValue } from '../../color-figma-design-token-value.ts';
import type { ColorFigmaDesignTokenObjectValue } from './color-figma-design-token-object-value.ts';

export function isColorFigmaDesignTokenObjectValue(
  input: ColorFigmaDesignTokenValue,
): input is ColorFigmaDesignTokenObjectValue {
  return typeof input === 'object';
}
