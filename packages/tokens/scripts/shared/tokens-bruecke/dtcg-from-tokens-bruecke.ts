import type { DesignTokensTree } from '../dtcg/design-token/tree/design-tokens-tree.ts';
import { tokensBrueckeTokensTreeToDesignTokensTree } from './to/dtcg/tree/tokens-bruecke-tokens-tree-to-design-tokens-tree.ts';
import type { TokensBrueckeDesignTokensTree } from './tokens-bruecke/tree/tokens-bruecke-design-tokens-tree.ts';

/*--*/

/*--*/
export interface TokensBrueckeRootExtensions {
  readonly 'tokens-bruecke-meta': {
    readonly useDTCGKeys: true;
    readonly colorMode: 'hex' | string;
    readonly variableCollections: readonly string[];
    readonly createdAt: string; // date in ISO format
  };
}

/*--*/
/*--*/

export function tokensBrueckeToDtcg(input: TokensBrueckeDesignTokensTree): DesignTokensTree {
  return tokensBrueckeTokensTreeToDesignTokensTree(input, { root: input, path: [] });
}
