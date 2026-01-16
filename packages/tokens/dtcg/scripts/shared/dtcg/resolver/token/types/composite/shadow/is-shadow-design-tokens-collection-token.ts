import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { ShadowDesignTokensCollectionToken } from './shadow-design-tokens-collection-token.ts';

export function isShadowDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is ShadowDesignTokensCollectionToken {
  return input.type === 'shadow';
}
