import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isCurlyReference } from '../../design-token/reference/types/curly/is-curly-reference.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export function pickDesignTokensTreeModeAsModifier(
  tree: DesignTokensTree,
  mode: string,
): DesignTokensTree | undefined {
  if (isDesignToken(tree)) {
    const { $extensions } = tree;

    if ($extensions !== undefined) {
      const { mode: extensionsMode } = $extensions;

      if (extensionsMode !== undefined) {
        const $newValue: unknown | undefined = extensionsMode[mode];
        if ($newValue !== undefined) {
          if (!isCurlyReference($newValue)) {
            throw new Error("Expected a curly reference as mode's value.");
          }

          return {
            $value: $newValue,
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
      const newChild: DesignTokensTree | undefined = pickDesignTokensTreeModeAsModifier(
        child,
        mode,
      );
      if (newChild !== undefined) {
        Reflect.set(newChildren, name, newChild);
        hasNewChildren = true;
      }
    }

    if (hasNewChildren) {
      return {
        ...newChildren,
      };
    } else {
      return undefined;
    }
  }
}
