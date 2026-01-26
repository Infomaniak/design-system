import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { DurationDesignTokensCollectionTokenValue } from './value/duration-design-tokens-collection-token-value.ts';

export type DurationDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'duration',
  DurationDesignTokensCollectionTokenValue
>;
