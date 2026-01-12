import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import type { CascadeInheritedPropertiesOfDesignTokensTreeContext } from './cascade-inherited-properties-of-design-tokens-tree-context.ts';
import { cascadeInheritedPropertiesOfDesignTokensTree } from './cascade-inherited-properties-of-design-tokens-tree.ts';

export function cascadeInheritedPropertiesOfDesignTokensGroup(
  { $description, $type, $extends, $ref, $deprecated, $extensions, ...children }: DesignTokensGroup,
  ctx: CascadeInheritedPropertiesOfDesignTokensTreeContext,
): DesignTokensGroup {
  const subCtx: CascadeInheritedPropertiesOfDesignTokensTreeContext = {
    ...ctx,
    ...removeUndefinedProperties({
      $description,
      $type,
      $deprecated,
      $extensions,
    }),
  };

  return {
    ...removeUndefinedProperties({
      // ...subCtx,
      $extends,
      $ref,
    }),
    ...Object.fromEntries(
      Object.entries(children).map(
        ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
          return [name, cascadeInheritedPropertiesOfDesignTokensTree(child, subCtx)];
        },
      ),
    ),
  };
}
