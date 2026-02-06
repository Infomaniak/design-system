import type { StringTokensBrueckeDesignToken } from '../../../../../../../../tokens-bruecke/tokens-bruecke/token/types/string/string-tokens-bruecke-design-token.ts';
import type { GenericDesignToken } from '../../../../../../../design-token/token/generic-design-token.ts';

export function isStringFigmaDesignToken(
  input: GenericDesignToken,
): input is StringTokensBrueckeDesignToken {
  return input.$type === 'string';
}
