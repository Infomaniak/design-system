import type { ObjectShadowDesignTokensCollectionTokenValue } from './object-shadow-design-tokens-collection-token-value.ts';

export function isObjectShadowDesignTokensCollectionTokenValue(
  input: unknown,
): input is ObjectShadowDesignTokensCollectionTokenValue {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
