import type { GenericDesignToken } from '../../../../../dtcg/design-token/token/generic-design-token.ts';
import type { NumberTokensBrueckeDesignToken } from './number-tokens-bruecke-design-token.ts';

export function isNumberTokensBrueckeDesignToken(
  input: GenericDesignToken,
): input is NumberTokensBrueckeDesignToken {
  return input.$type === 'number';
}
