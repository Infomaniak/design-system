import { removeUndefinedProperties } from '../../../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import type { DesignTokensTree } from '../../../tree/design-tokens-tree.js';
import {
  normalizeInheritedPropertiesOfDesignTokensTree,
  type NormalizeInheritedPropertiesOfDesignTokensTreeContext,
} from '../../../tree/normalize/inherited-properties/normalize-inherited-properties-of-design-tokens-tree.js';
import type { DesignTokensGroup } from '../../design-tokens-group.js';

export function normalizeInheritedPropertiesOfDesignTokensGroup(
  { $description, $type, $extends, $ref, $deprecated, $extensions, ...children }: DesignTokensGroup,
  ctx: NormalizeInheritedPropertiesOfDesignTokensTreeContext,
): DesignTokensGroup {
  const subCtx: NormalizeInheritedPropertiesOfDesignTokensTreeContext = {
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
          return [name, normalizeInheritedPropertiesOfDesignTokensTree(child, subCtx)];
        },
      ),
    ),
  };
}
