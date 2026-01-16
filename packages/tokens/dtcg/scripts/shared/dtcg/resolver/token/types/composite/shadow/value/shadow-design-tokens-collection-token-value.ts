import type { ObjectArrayShadowDesignTokensCollectionTokenValue } from './types/object-array/object-array-shadow-design-tokens-collection-token-value.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from './types/object/object-shadow-design-tokens-collection-token-value.ts';

export type ShadowDesignTokensCollectionTokenValue =
  | ObjectShadowDesignTokensCollectionTokenValue
  | ObjectArrayShadowDesignTokensCollectionTokenValue;
