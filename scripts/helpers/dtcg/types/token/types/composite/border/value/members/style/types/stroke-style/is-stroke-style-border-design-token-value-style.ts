import type { BorderDesignTokenValueStyle } from '../../border-design-token-value-style.ts';
import type { StrokeStyleBorderDesignTokenValueStyle } from './stroke-style-border-design-token-value-style.ts';

export function isStrokeStyleBorderDesignTokenValueStyle(
  input: BorderDesignTokenValueStyle,
): input is StrokeStyleBorderDesignTokenValueStyle {
  return typeof input === 'object' && input !== null;
}
