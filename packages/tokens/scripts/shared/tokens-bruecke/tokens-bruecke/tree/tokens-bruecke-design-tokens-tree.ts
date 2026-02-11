import type { TokensBrueckeDesignTokensGroup } from '../group/tokens-bruecke-design-tokens-group.ts';
import type { GenericTokensBrueckeDesignToken } from '../token/generic-tokens-bruecke-design-token.ts';

export type TokensBrueckeDesignTokensTree =
  | TokensBrueckeDesignTokensGroup
  | GenericTokensBrueckeDesignToken;
