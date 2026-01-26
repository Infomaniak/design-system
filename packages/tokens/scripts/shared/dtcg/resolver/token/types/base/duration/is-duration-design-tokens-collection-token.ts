import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { DurationDesignTokensCollectionToken } from './duration-design-tokens-collection-token.ts';

export function isDurationDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is DurationDesignTokensCollectionToken {
  return input.type === 'duration';
}
