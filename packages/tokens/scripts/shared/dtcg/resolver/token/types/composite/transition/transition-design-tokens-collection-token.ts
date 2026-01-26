import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { TransitionDesignTokensCollectionTokenValue } from './value/transition-design-tokens-collection-token-value.ts';

export type TransitionDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'transition',
  TransitionDesignTokensCollectionTokenValue
>;
