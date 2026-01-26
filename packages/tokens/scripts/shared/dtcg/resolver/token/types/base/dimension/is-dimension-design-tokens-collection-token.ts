import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionToken } from './dimension-design-tokens-collection-token.ts';

export function isDimensionDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is DimensionDesignTokensCollectionToken {
  return input.type === 'dimension';
}
