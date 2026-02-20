import type { GenericTokensBrueckeDesignToken } from '../../generic-tokens-bruecke-design-token.ts';
import type { StringTokensBrueckeDesignToken } from './string-tokens-bruecke-design-token.ts';

export function isStringTokensBrueckeDesignToken(
  input: GenericTokensBrueckeDesignToken,
): input is StringTokensBrueckeDesignToken {
  return input.$type === 'string';
}
