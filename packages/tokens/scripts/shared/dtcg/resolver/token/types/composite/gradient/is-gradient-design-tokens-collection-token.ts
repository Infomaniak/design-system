import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { GradientDesignTokensCollectionToken } from './gradient-design-tokens-collection-token.ts';

export function isGradientDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is GradientDesignTokensCollectionToken {
  return input.type === 'gradient';
}
