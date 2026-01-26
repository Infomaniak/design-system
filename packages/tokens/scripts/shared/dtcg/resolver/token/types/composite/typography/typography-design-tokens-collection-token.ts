import type { DesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionTokenValue } from './value/typography-design-tokens-collection-token-value.ts';

export type TypographyDesignTokensCollectionToken = DesignTokensCollectionTokenWithType<
  'typography',
  TypographyDesignTokensCollectionTokenValue
>;
