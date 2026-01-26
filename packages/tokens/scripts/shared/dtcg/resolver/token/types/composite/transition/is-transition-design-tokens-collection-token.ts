import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { TransitionDesignTokensCollectionToken } from './transition-design-tokens-collection-token.ts';

export function isTransitionDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is TransitionDesignTokensCollectionToken {
  return input.type === 'transition';
}
