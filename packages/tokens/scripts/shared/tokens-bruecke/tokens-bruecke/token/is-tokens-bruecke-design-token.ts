import type { TokensBrueckeDesignTokensTree } from '../tree/tokens-bruecke-design-tokens-tree.ts';
import type { GenericTokensBrueckeDesignToken } from './generic-tokens-bruecke-design-token.ts';

export function isTokensBrueckeDesignToken(
  input: TokensBrueckeDesignTokensTree,
): input is GenericTokensBrueckeDesignToken {
  return Reflect.has(input, '$value');
}
