import type { GenericDesignTokensCollectionToken } from '../../../design-tokens-collection-token.ts';
import type { FontFamilyDesignTokensCollectionToken } from './font-family-design-tokens-collection-token.ts';

export function isFontFamilyDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionToken,
): input is FontFamilyDesignTokensCollectionToken {
  return input.type === 'fontFamily';
}
