import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import { DESIGN_TOKENS_TREE_EXTENDS_RESOLVING } from './design-tokens-tree-extends-resolving.constant.ts';

export interface ResolveDesignTokensTreeExtendsContext {
  readonly root: DesignTokensTree;
  readonly cache: Map<
    DesignTokensTree,
    DesignTokensTree | typeof DESIGN_TOKENS_TREE_EXTENDS_RESOLVING
  >;
}
