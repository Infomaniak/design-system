import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export function removeDesignTokensTreeModes(tree: DesignTokensTree): DesignTokensTree {
  if (isDesignToken(tree)) {
    const { $extensions, ...remainingTree } = tree;

    if ($extensions !== undefined) {
      const { mode: extensionsMode, ...remainingExtensions } = $extensions;

      if (extensionsMode !== undefined) {
        return {
          ...remainingTree,
          ...removeUndefinedProperties({
            $extensions:
              Object.keys(remainingExtensions).length === 0 ? undefined : remainingExtensions,
          }),
        };
      }
    }

    return tree;
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
        $extensions,
      }),
      ...Object.fromEntries(
        Object.entries(children).map(
          ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
            return [name, removeDesignTokensTreeModes(child)];
          },
        ),
      ),
    };
  }
}
