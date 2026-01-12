import { normalizeExtendsOfDesignTokensGroup } from '../../../group/normalize/extends/normalize-extends-of-design-tokens-group.js';
import { isDesignToken } from '../../../token/is-design-token.js';
import { normalizeExtendsOfDesignToken } from '../../../token/normalize/extends/normalize-extends-of-design-token.js';
import type { DesignTokensTree } from '../../design-tokens-tree.js';

export const DESIGN_TOKENS_TREE_EXTENDS_RESOLVING = Symbol('DESIGN_TOKENS_TREE_EXTENDS_RESOLVING');

export interface NormalizeExtendsOfDesignTokensTreeContext {
  readonly root: DesignTokensTree;
  readonly cache: Map<
    DesignTokensTree,
    DesignTokensTree | typeof DESIGN_TOKENS_TREE_EXTENDS_RESOLVING
  >;
}

export function normalizeExtendsOfDesignTokensTree(
  input: DesignTokensTree,
  ctx: NormalizeExtendsOfDesignTokensTreeContext = {
    root: input,
    cache: new Map(),
  },
): DesignTokensTree {
  return isDesignToken(input) ?
      normalizeExtendsOfDesignToken(input, ctx)
    : normalizeExtendsOfDesignTokensGroup(input, ctx);
}
