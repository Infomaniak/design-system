import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionToken } from './number-design-tokens-collection-token.ts';

export function isNumberDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is NumberDesignTokensCollectionToken {
  return input.type === 'number';
}
