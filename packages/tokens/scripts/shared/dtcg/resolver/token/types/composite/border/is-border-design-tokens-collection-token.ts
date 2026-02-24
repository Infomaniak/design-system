import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionToken } from './border-design-tokens-collection-token.ts';

export function isBorderDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is BorderDesignTokensCollectionToken {
  return input.type === 'border';
}
