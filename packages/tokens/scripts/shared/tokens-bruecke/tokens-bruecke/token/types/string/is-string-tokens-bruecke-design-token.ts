import type { GenericDesignToken } from '../../../../../dtcg/design-token/token/generic-design-token.ts';
import type { StringTokensBrueckeDesignToken } from './string-tokens-bruecke-design-token.ts';

export function isStringTokensBrueckeDesignToken(
  input: GenericDesignToken,
): input is StringTokensBrueckeDesignToken {
  return input.$type === 'string';
}
