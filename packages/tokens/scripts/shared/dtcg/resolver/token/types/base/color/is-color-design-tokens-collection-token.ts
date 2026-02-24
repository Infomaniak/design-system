import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionToken } from './color-design-tokens-collection-token.ts';

export function isColorDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is ColorDesignTokensCollectionToken {
  return input.type === 'color';
}
