import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionToken } from './stroke-style-design-tokens-collection-token.ts';

export function isStrokeStyleDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is StrokeStyleDesignTokensCollectionToken {
  return input.type === 'strokeStyle';
}
