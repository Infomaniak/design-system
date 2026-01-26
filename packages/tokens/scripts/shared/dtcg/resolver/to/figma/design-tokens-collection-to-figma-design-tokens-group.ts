import { setObjectDeepProperty } from '../../../../../../../../scripts/helpers/misc/object/set-object-deep-property.ts';
import { DesignTokensCollection } from '../../design-tokens-collection.ts';
import type { FigmaDesignTokensGroup } from './figma/group/figma-design-tokens-group.ts';
import type { FigmaDesignTokensTree } from './figma/tree/figma-design-tokens-tree.ts';
import { designTokensCollectionTokenToFigmaDesignTokensTree } from './token/design-tokens-collection-token-to-figma-design-tokens-tree.ts';

export function designTokensCollectionToFigmaDesignTokensGroup(
  collection: DesignTokensCollection,
): FigmaDesignTokensTree {
  const output: FigmaDesignTokensGroup = {};

  for (const token of collection.getMergedTokens()) {
    setObjectDeepProperty(
      output,
      token.name,
      designTokensCollectionTokenToFigmaDesignTokensTree(token, collection.resolve(token)),
    );
  }

  return output;
}
