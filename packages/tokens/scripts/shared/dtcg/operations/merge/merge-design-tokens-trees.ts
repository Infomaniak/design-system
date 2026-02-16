import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import type { ArrayDesignTokenName } from '../../resolver/token/name/array-design-token-name.ts';

export function mergeDesignTokensTrees(
  parentTree: DesignTokensTree,
  childTree: DesignTokensTree,
  insertionPath: ArrayDesignTokenName,
  insertionIndex: number = 0,
): DesignTokensTree {
  if (isDesignToken(parentTree) && isDesignToken(childTree)) {
    throw new Error(
      `Cannot merge a design token into a design token: ${JSON.stringify(insertionPath.slice(0, insertionIndex + 1))}.`,
    );
  }

  const mergedChild: DesignTokensTree =
    insertionIndex < insertionPath.length
      ? {
          [insertionPath[insertionIndex]]: mergeDesignTokensTrees(
            Reflect.has(parentTree, insertionPath[insertionIndex])
              ? Reflect.get(parentTree, insertionPath[insertionIndex])
              : {},
            childTree,
            insertionPath,
            insertionIndex + 1,
          ),
        }
      : childTree;

  if (isDesignToken(parentTree)) {
    if (isDesignToken(mergedChild)) {
      throw new Error(
        `Cannot merge a design token into a design token: ${JSON.stringify(insertionPath.slice(0, insertionIndex + 1))}.`,
      );
    } else {
      return {
        $root: parentTree,
        ...mergedChild,
      };
    }
  } else {
    if (isDesignToken(mergedChild)) {
      return {
        $root: mergedChild,
        ...parentTree,
      };
    } else {
      return {
        ...parentTree,
        ...mergedChild,
      };
    }
  }
}
