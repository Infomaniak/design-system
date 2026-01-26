import type { ObjectStrokeStyleDesignTokenValue } from './types/object/object-stroke-style-design-token-value.ts';
import type { PredefinedStrokeStyleDesignTokenValue } from './types/predefined/predefined-stroke-style-design-token-value.ts';

export type StrokeStyleDesignTokenValue =
  | PredefinedStrokeStyleDesignTokenValue
  | ObjectStrokeStyleDesignTokenValue;
