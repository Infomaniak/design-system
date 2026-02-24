import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionToken } from './typography-design-tokens-collection-token.ts';

export function isTypographyDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is TypographyDesignTokensCollectionToken {
  return input.type === 'typography';
}
