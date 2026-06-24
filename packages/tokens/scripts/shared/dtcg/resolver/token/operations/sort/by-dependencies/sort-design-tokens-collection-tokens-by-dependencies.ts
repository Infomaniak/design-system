import { mapGetOrInsertComputed } from '../../../../../../../../../../scripts/helpers/misc/map/upsert.ts';
import type { CurlyReference } from '../../../../../design-token/reference/types/curly/curly-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { DesignTokensCollection } from '../../../../design-tokens-collection.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericResolvedDesignTokensCollectionToken,
} from '../../../design-tokens-collection-token.ts';
import { isDesignTokensCollectionTokenReferencing } from '../../is-referencing/is-design-tokens-collection-token-referencing.ts';

export function sortDesignTokensCollectionTokensByDependencies(
  collection: DesignTokensCollection,
  tokens: Iterable<GenericDesignTokensCollectionToken>,
): GenericDesignTokensCollectionToken[] {
  const resolved: Map<
    GenericDesignTokensCollectionToken,
    GenericResolvedDesignTokensCollectionToken
  > = new Map();

  /**
   * Returns true if tokenA is referencing tokenB (directly or indirectly).
   */
  const isTokenReferencing = (
    tokenA: GenericDesignTokensCollectionToken,
    nameB: CurlyReference,
  ): boolean => {
    const resolvedTokenA: GenericResolvedDesignTokensCollectionToken = mapGetOrInsertComputed(
      resolved,
      tokenA,
      (): GenericResolvedDesignTokensCollectionToken => collection.resolve(tokenA),
    );

    if (
      resolvedTokenA.trace.length === 1 &&
      isDesignTokensCollectionTokenReferencing(
        {
          ...tokenA,
          type: resolvedTokenA.type,
        },
        nameB,
      )
    ) {
      // A directly points on B
      return true;
    }

    for (let i: number = 1; i < resolvedTokenA.trace.length; i++) {
      const traceAName: CurlyReference = segmentsReferenceToCurlyReference(resolvedTokenA.trace[i]);
      if (traceAName === nameB) {
        // A indirectly points on B
        return true;
      }
    }

    return false;
  };

  return (Array.isArray(tokens) ? tokens : Array.from(tokens)).toSorted(
    (
      tokenA: GenericDesignTokensCollectionToken,
      tokenB: GenericDesignTokensCollectionToken,
    ): number => {
      if (tokenA === tokenB) {
        return 0;
      }

      const nameA: CurlyReference = segmentsReferenceToCurlyReference(tokenA.name);
      const nameB: CurlyReference = segmentsReferenceToCurlyReference(tokenB.name);

      if (nameA === nameB) {
        return 0;
      }

      if (isTokenReferencing(tokenA, nameB)) {
        return 1;
      } else if (isTokenReferencing(tokenB, nameA)) {
        return -1;
      } else {
        return 0;
      }
    },
  );
}
