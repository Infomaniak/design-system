import type { GenericDesignTokensCollectionToken } from '../../../../../token/design-tokens-collection-token.ts';
import type { FigmaDesignTokenScope } from '../../../figma/token/figma-design-token.ts';

export function getDesignTokensCollectionTokenScopes(
  token: GenericDesignTokensCollectionToken,
): readonly FigmaDesignTokenScope[] | undefined {
  return token.extensions !== undefined &&
    Reflect.has(token.extensions, 'scopes') &&
    Array.isArray(Reflect.get(token.extensions, 'scopes'))
    ? (Reflect.get(token.extensions, 'scopes') as readonly FigmaDesignTokenScope[])
    : undefined;
}
