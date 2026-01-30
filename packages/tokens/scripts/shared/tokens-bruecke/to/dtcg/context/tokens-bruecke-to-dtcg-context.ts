import type { DesignTokenNameSegments } from '../../../../dtcg/design-token/token/name/segments/design-token-name-segments.ts';
import type { TokensBrueckeDesignTokensTree } from '../../../tokens-bruecke/tree/tokens-bruecke-design-tokens-tree.ts';

export interface TokensBrueckeToDtcgContext {
  readonly root: TokensBrueckeDesignTokensTree;
  readonly path: DesignTokenNameSegments;
}
