import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionToken } from './number-design-tokens-collection-token.ts';

export function isNumberDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is NumberDesignTokensCollectionToken {
  return input.type === 'number';
}
