import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { ShadowDesignTokensCollectionToken } from './shadow-design-tokens-collection-token.ts';

export function isShadowDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is ShadowDesignTokensCollectionToken {
  return input.type === 'shadow';
}
