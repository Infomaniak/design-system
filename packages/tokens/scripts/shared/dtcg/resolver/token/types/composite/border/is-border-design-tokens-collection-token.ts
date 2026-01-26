import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionToken } from './border-design-tokens-collection-token.ts';

export function isBorderDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is BorderDesignTokensCollectionToken {
  return input.type === 'border';
}
