import type { DesignTokensTree } from '../../../../dtcg/design-token/tree/design-tokens-tree.ts';
import { isTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/is-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignTokensTree } from '../../../tokens-bruecke/tree/tokens-bruecke-design-tokens-tree.ts';
import type { TokensBrueckeToDtcgContext } from '../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeTokensGroupToDesignTokensGroup } from '../group/tokens-bruecke-tokens-group-to-design-tokens-group.ts';
import { tokensBrueckeDesignTokenToDesignToken } from '../token/tokens-bruecke-design-token-to-design-token.ts';

export function tokensBrueckeTokensTreeToDesignTokensTree(
  input: TokensBrueckeDesignTokensTree,
  ctx: TokensBrueckeToDtcgContext,
): DesignTokensTree {
  if (isTokensBrueckeDesignToken(input)) {
    return tokensBrueckeDesignTokenToDesignToken(input, ctx);
  } else {
    return tokensBrueckeTokensGroupToDesignTokensGroup(input, ctx);
  }
}
