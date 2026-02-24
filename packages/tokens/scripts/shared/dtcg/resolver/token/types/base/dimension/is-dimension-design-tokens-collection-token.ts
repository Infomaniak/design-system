import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionToken } from './dimension-design-tokens-collection-token.ts';

export function isDimensionDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is DimensionDesignTokensCollectionToken {
  return input.type === 'dimension';
}
