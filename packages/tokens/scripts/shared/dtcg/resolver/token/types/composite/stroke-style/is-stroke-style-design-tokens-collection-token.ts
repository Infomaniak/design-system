import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionToken } from './stroke-style-design-tokens-collection-token.ts';

export function isStrokeStyleDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is StrokeStyleDesignTokensCollectionToken {
  return input.type === 'strokeStyle';
}
