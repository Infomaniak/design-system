import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { MATERIAL_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';

/**
 * Returns `true` if the token is a material token.
 */
export function isMaterialToken(token: GenericDesignTokensCollectionToken): boolean {
  return token.files.some((file: string): boolean => file.includes(MATERIAL_DIRECTORY_NAME));
}
