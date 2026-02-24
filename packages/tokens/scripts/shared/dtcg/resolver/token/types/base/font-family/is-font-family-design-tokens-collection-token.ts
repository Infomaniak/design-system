import type { GenericDesignTokensCollectionTokenWithType } from '../../../design-tokens-collection-token.ts';
import type { FontFamilyDesignTokensCollectionToken } from './font-family-design-tokens-collection-token.ts';

export function isFontFamilyDesignTokensCollectionToken(
  input: GenericDesignTokensCollectionTokenWithType,
): input is FontFamilyDesignTokensCollectionToken {
  return input.type === 'fontFamily';
}
