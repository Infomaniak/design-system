import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionToken } from './color-design-tokens-collection-token.ts';

export function isColorDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is ColorDesignTokensCollectionToken {
  return input.type === 'color';
}
