import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { CubicBezierDesignTokensCollectionToken } from './cubic-bezier-design-tokens-collection-token.ts';

export function isCubicBezierDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is CubicBezierDesignTokensCollectionToken {
  return input.type === 'cubicBezier';
}
