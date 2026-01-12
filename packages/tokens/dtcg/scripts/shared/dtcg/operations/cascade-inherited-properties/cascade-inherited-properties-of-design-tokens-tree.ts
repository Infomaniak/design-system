import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

import { cascadeInheritedPropertiesOfDesignToken } from './cascade-inherited-properties-of-design-token.ts';
import { cascadeInheritedPropertiesOfDesignTokensGroup } from './cascade-inherited-properties-of-design-tokens-group.ts';
import {
  type CascadeInheritedPropertiesOfDesignTokensTreeContext,
  createInitialCascadeInheritedPropertiesOfDesignTokensTreeContext,
} from './cascade-inherited-properties-of-design-tokens-tree-context.ts';

export function cascadeInheritedPropertiesOfDesignTokensTree(
  input: DesignTokensTree,
  ctx: CascadeInheritedPropertiesOfDesignTokensTreeContext = createInitialCascadeInheritedPropertiesOfDesignTokensTreeContext(),
): DesignTokensTree {
  return isDesignToken(input)
    ? cascadeInheritedPropertiesOfDesignToken(input, ctx)
    : cascadeInheritedPropertiesOfDesignTokensGroup(input, ctx);
}
