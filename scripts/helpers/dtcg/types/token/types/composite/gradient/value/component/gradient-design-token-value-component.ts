import type { ObjectGradientDesignTokenValue } from './types/object/object-gradient-design-token-value.ts';
import type { ReferenceGradientDesignTokenValue } from './types/reference/reference-gradient-design-token-value.ts';

export type GradientDesignTokenValueComponent =
  | ObjectGradientDesignTokenValue
  | ReferenceGradientDesignTokenValue;
