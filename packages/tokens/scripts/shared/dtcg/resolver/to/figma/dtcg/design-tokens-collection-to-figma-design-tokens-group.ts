import { insertFigmaDesignTokensTreeIntoFigmaDesignTokensGroup } from '../../../../../figma/insert-figma-design-tokens-tree-into-figma-design-tokens-group.ts';
import { DesignTokensCollection } from '../../../design-tokens-collection.ts';
import type { FigmaDesignTokensGroup } from '../figma/group/figma-design-tokens-group.ts';
import { designTokensCollectionTokenToFigmaDesignTokensTree } from './token/design-tokens-collection-token-to-figma-design-tokens-tree.ts';

export function designTokensCollectionToFigmaDesignTokensGroup(
  collection: DesignTokensCollection,
): FigmaDesignTokensGroup {
  const figmaTokens: FigmaDesignTokensGroup = {};

  for (const token of collection.tokens()) {
    insertFigmaDesignTokensTreeIntoFigmaDesignTokensGroup(
      figmaTokens,
      token.name,
      designTokensCollectionTokenToFigmaDesignTokensTree(token, collection.resolve(token)),
    );
  }

  return figmaTokens;
}
