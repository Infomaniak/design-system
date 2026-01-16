import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { BorderDesignTokensCollectionTokenValue } from './value/border-design-tokens-collection-token-value.ts';

export type BorderDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'border',
  BorderDesignTokensCollectionTokenValue
>;
