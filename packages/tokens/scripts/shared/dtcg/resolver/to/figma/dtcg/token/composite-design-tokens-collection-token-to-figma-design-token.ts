import { isCurlyReference } from '../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type {
  GenericDesignTokensCollectionToken,
  InferDesignTokensCollectionTokenValue,
} from '../../../../token/design-tokens-collection-token.ts';
import type { FigmaDesignTokensGroup } from '../../figma/group/figma-design-tokens-group.ts';
import type { FigmaDesignTokensTree } from '../../figma/tree/figma-design-tokens-tree.ts';

export type MapCompositeTokenValues<GToken extends GenericDesignTokensCollectionToken> = {
  [GKey in keyof InferDesignTokensCollectionTokenValue<GToken>]: (
    value: InferDesignTokensCollectionTokenValue<GToken>[GKey],
    key: GKey,
    token: GToken,
  ) => FigmaDesignTokensTree;
};

export function compositeDesignTokensCollectionTokenToFigmaDesignToken<
  GToken extends GenericDesignTokensCollectionToken,
>(token: GToken, map: MapCompositeTokenValues<GToken>): FigmaDesignTokensGroup {
  if (isCurlyReference(token.value)) {
    const reference: SegmentsReference = curlyReferenceToSegmentsReference(token.value);

    return Object.fromEntries(
      Object.entries(map).map(([key, mapValue]): [string, FigmaDesignTokensTree] => {
        return [key, mapValue(segmentsReferenceToCurlyReference([...reference, key]), key, token)];
      }),
    );
  } else {
    return Object.fromEntries(
      Object.entries(map).map(([key, mapValue]): [string, FigmaDesignTokensTree] => {
        return [key, mapValue(token.value[key], key, token)];
      }),
    );
  }
}
