import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { ShadowDesignTokensCollectionTokenValue } from './value/shadow-design-tokens-collection-token-value.ts';

export type ShadowDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'shadow',
  ShadowDesignTokensCollectionTokenValue
>;
