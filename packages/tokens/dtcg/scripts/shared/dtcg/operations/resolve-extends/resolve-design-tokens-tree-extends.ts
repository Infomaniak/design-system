import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import { createInitialResolveDesignTokensTreeExtendsContext } from './create-initial-resolve-design-tokens-tree-extends-context.ts';
import { resolveDesignTokensGroupExtends } from './resolve-design-tokens-group-extends.ts';
import type { ResolveDesignTokensTreeExtendsContext } from './resolve-design-tokens-tree-extends-context.ts';

export function resolveDesignTokensTreeExtends(
  input: DesignTokensTree,
  ctx: ResolveDesignTokensTreeExtendsContext = createInitialResolveDesignTokensTreeExtendsContext(
    input,
  ),
): DesignTokensTree {
  return isDesignToken(input) ? input : resolveDesignTokensGroupExtends(input, ctx);
}
