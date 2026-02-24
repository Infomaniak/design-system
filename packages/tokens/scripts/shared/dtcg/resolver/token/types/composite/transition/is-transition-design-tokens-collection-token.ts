import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { TransitionDesignTokensCollectionToken } from './transition-design-tokens-collection-token.ts';

export function isTransitionDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is TransitionDesignTokensCollectionToken {
  return input.type === 'transition';
}
