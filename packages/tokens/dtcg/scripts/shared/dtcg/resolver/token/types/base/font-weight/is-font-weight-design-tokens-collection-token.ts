import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { FontWeightDesignTokensCollectionToken } from './font-weight-design-tokens-collection-token.ts';

export function isFontWeightDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is FontWeightDesignTokensCollectionToken {
  return input.type === 'fontWeight';
}
