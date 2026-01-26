import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionTokenValue } from './value/number-design-tokens-collection-token-value.ts';

export type NumberDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'number',
  NumberDesignTokensCollectionTokenValue
>;
