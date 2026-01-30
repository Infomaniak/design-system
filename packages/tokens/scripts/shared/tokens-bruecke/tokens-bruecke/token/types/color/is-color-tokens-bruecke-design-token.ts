import type { GenericDesignToken } from '../../../../../dtcg/design-token/token/generic-design-token.ts';
import type { ColorTokensBrueckeDesignToken } from './color-tokens-bruecke-design-token.ts';

export function isColorTokensBrueckeDesignToken(
  input: GenericDesignToken,
): input is ColorTokensBrueckeDesignToken {
  return input.$type === 'color';
}
