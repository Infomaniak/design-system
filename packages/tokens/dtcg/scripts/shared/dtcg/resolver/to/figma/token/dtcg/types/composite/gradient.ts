import type { ResolvedDesignTokensCollectionToken } from '../../../../../../token/design-tokens-collection-token.ts';
import type { GradientDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/gradient/value/gradient-design-tokens-collection-token-value.ts';

export function gradientDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  _token: ResolvedDesignTokensCollectionToken<'gradient', GradientDesignTokensCollectionTokenValue>,
): never {
  throw new Error('Gradient design tokens are not supported yet by figma.');
}
