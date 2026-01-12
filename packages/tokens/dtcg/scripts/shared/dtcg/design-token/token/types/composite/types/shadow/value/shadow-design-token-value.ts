import type { ObjectArrayShadowDesignTokenValue } from './types/object-array/object-array-shadow-design-token-value.ts';
import type { ObjectShadowDesignTokenValue } from './types/object/object-shadow-design-token-value.ts';

export type ShadowDesignTokenValue =
  | ObjectShadowDesignTokenValue
  | ObjectArrayShadowDesignTokenValue;
