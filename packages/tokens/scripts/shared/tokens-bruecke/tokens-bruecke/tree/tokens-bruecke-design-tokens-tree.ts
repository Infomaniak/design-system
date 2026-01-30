import type { TokensBrueckeDesignTokensGroup } from '../group/tokens-bruecke-design-tokens-group.ts';
import type { TokensBrueckeDesignToken } from '../token/tokens-bruecke-design-token.ts';

export type TokensBrueckeDesignTokensTree =
  | TokensBrueckeDesignTokensGroup
  | TokensBrueckeDesignToken;
