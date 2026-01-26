import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { GradientDesignTokensCollectionTokenValue } from './value/gradient-design-tokens-collection-token-value.ts';

export type GradientDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'gradient',
  GradientDesignTokensCollectionTokenValue
>;
