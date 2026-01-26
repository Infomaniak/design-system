import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { StrokeStyleDesignTokensCollectionTokenValue } from './value/stroke-style-design-tokens-collection-token-value.ts';

export type StrokeStyleDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'strokeStyle',
  StrokeStyleDesignTokensCollectionTokenValue
>;
