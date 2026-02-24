import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { FontWeightDesignTokensCollectionToken } from './font-weight-design-tokens-collection-token.ts';

export function isFontWeightDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is FontWeightDesignTokensCollectionToken {
  return input.type === 'fontWeight';
}
