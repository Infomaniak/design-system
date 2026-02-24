import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { DurationDesignTokensCollectionToken } from './duration-design-tokens-collection-token.ts';

export function isDurationDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is DurationDesignTokensCollectionToken {
  return input.type === 'duration';
}
