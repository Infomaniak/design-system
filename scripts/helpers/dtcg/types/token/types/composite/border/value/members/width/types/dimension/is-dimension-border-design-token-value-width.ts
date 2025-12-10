import type { BorderDesignTokenValueWidth } from '../../border-design-token-value-width.ts';
import type { DimensionBorderDesignTokenValueWidth } from './dimension-border-design-token-value-width.ts';

export function isDimensionBorderDesignTokenValueWidth(
  input: BorderDesignTokenValueWidth,
): input is DimensionBorderDesignTokenValueWidth {
  return typeof input === 'object' && input !== null;
}
