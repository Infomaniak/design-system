import type { StrokeStyleDesignTokenValue } from '../../stroke-style-design-token-value.ts';
import type { ObjectStrokeStyleDesignTokenValue } from './object-stroke-style-design-token-value.ts';

export function isObjectStrokeStyleDesignTokenValue(
  input: StrokeStyleDesignTokenValue,
): input is ObjectStrokeStyleDesignTokenValue {
  return typeof input === 'object' && input !== null;
}
