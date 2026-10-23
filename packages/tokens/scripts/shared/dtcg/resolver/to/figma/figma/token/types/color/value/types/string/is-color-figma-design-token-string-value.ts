import type { ColorFigmaDesignTokenValue } from '../../color-figma-design-token-value.ts';
import type { ColorFigmaDesignTokenStringValue } from './color-figma-design-token-string-value.ts';

export function isColorFigmaDesignTokenStringValue(
  input: ColorFigmaDesignTokenValue,
): input is ColorFigmaDesignTokenStringValue {
  return typeof input === 'string';
}
