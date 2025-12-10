import type { StrokeStyleDesignTokenValue } from '../../stroke-style-design-token-value.ts';
import type { PredefinedStrokeStyleDesignTokenValue } from './predefined-stroke-style-design-token-value.ts';

export function isPredefinedStrokeStyleDesignTokenValue(
  input: StrokeStyleDesignTokenValue,
): input is PredefinedStrokeStyleDesignTokenValue {
  return typeof input === 'string';
}
