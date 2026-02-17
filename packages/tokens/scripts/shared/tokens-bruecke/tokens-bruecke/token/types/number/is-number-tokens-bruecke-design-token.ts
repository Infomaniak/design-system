import type { GenericTokensBrueckeDesignToken } from '../../generic-tokens-bruecke-design-token.ts';
import type { NumberTokensBrueckeDesignToken } from './number-tokens-bruecke-design-token.ts';

export function isNumberTokensBrueckeDesignToken(
  input: GenericTokensBrueckeDesignToken,
): input is NumberTokensBrueckeDesignToken {
  return input.$type === 'number';
}
