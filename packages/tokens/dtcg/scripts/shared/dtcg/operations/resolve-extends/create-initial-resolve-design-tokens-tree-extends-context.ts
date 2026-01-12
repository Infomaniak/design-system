import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import type { ResolveDesignTokensTreeExtendsContext } from './resolve-design-tokens-tree-extends-context.ts';

export function createInitialResolveDesignTokensTreeExtendsContext(
  root: DesignTokensTree,
): ResolveDesignTokensTreeExtendsContext {
  return {
    root,
    cache: new Map(),
  };
}
