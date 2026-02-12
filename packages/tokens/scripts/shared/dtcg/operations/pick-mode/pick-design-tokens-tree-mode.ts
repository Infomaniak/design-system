import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export function pickDesignTokensTreeMode(
  tree: DesignTokensTree,
  mode: string,
): DesignTokensTree | undefined {
  if (isDesignToken(tree)) {
    const { $value, $extensions, ...remainingTree } = tree;

    if ($extensions !== undefined) {
      const { mode: extensionsMode, ...remainingExtensions } = $extensions;

      if (extensionsMode !== undefined) {
        const $newValue: unknown | undefined = extensionsMode[mode];
        if ($newValue !== undefined) {
          return {
            $value: $newValue,
            ...remainingTree,
            ...removeUndefinedProperties({
              $extensions:
                Object.keys(remainingExtensions).length === 0 ? undefined : remainingExtensions,
            }),
          };
        }
      }
    }

    return undefined;
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

    let hasNewChildren: boolean = false;
    const newChildren: Record<string, DesignTokensTree> = {};

    for (const [name, child] of Object.entries(children)) {
      const newChild: DesignTokensTree | undefined = pickDesignTokensTreeMode(child, mode);
      if (newChild !== undefined) {
        Reflect.set(newChildren, name, newChild);
        hasNewChildren = true;
      }
    }

    if (hasNewChildren) {
      return {
        ...removeUndefinedProperties({
          $description,
          $type,
          $extends,
          $ref,
          $deprecated,
          $extensions,
        }),
        ...newChildren,
      };
    } else {
      return undefined;
    }
  }
}
