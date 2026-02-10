import type { DesignTokensTree } from '../../../dtcg/design-token/tree/design-tokens-tree.ts';
import type { TokensBrueckeDesignTokensTree } from '../../tokens-bruecke/tree/tokens-bruecke-design-tokens-tree.ts';
import { tokensBrueckeTokensTreeToDesignTokensTree } from './tree/tokens-bruecke-tokens-tree-to-design-tokens-tree.ts';

export function tokensBrueckeToDtcg(input: TokensBrueckeDesignTokensTree): DesignTokensTree {
  return tokensBrueckeTokensTreeToDesignTokensTree(input, { root: input, path: [] });
}
