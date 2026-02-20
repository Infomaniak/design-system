import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export function removeDesignTokensTreeExtensions(tree: DesignTokensTree): DesignTokensTree {
  if (isDesignToken(tree)) {
    const { $extensions, ...remainingTree } = tree;

    return remainingTree;
  } else {
    const {
      $description,
      $type,
      $extends,
      $ref,
      $deprecated,
      $extensions,
      ...children
    }: DesignTokensGroup = tree;

    return {
      ...removeUndefinedProperties({
        $description,
        $type,
        $extends,
        $ref,
        $deprecated,
      }),
      ...Object.fromEntries(
        Object.entries(children).map(
          ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
            return [name, removeDesignTokensTreeExtensions(child)];
          },
        ),
      ),
    };
  }
}
