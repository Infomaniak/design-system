import { DesignTokensCollection } from '../../design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../token/design-tokens-collection-token.ts';
import { createDesignTokensCollectionTokenFilteredByPath } from './create-design-tokens-collection-token-filtered-by-path.ts';

export function getTokensOfDesignTokensCollectionFilteredByPath(
  collection: DesignTokensCollection,
  expectedPath: string,
): IteratorObject<GenericDesignTokensCollectionToken> {
  return collection.tokens().filter(createDesignTokensCollectionTokenFilteredByPath(expectedPath));
}
