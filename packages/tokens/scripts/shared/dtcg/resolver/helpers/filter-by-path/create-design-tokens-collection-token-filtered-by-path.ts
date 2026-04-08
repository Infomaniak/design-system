import type { GenericDesignTokensCollectionToken } from '../../token/design-tokens-collection-token.ts';

export function createDesignTokensCollectionTokenFilteredByPath(
  expectedPath: string,
): (token: GenericDesignTokensCollectionToken) => boolean {
  return (token: GenericDesignTokensCollectionToken): boolean => {
    return token.files.some((path: string): boolean => path.includes(expectedPath));
  };
}
