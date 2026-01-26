import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionToken } from './typography-design-tokens-collection-token.ts';

export function isTypographyDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is TypographyDesignTokensCollectionToken {
  return input.type === 'typography';
}
