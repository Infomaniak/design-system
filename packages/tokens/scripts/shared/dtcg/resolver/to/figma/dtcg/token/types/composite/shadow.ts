import type { ResolvedDesignTokensCollectionToken } from '../../../../../../token/design-tokens-collection-token.ts';
import type { ShadowDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/shadow/value/shadow-design-tokens-collection-token-value.ts';

export function shadowDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  _token: ResolvedDesignTokensCollectionToken<'shadow', ShadowDesignTokensCollectionTokenValue>,
): never {
  throw new Error('Shadow design tokens are not supported yet by figma.');
}
