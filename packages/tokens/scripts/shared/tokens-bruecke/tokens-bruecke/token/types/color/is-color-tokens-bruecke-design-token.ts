import type { GenericTokensBrueckeDesignToken } from '../../generic-tokens-bruecke-design-token.ts';
import type { ColorTokensBrueckeDesignToken } from './color-tokens-bruecke-design-token.ts';

export function isColorTokensBrueckeDesignToken(
  input: GenericTokensBrueckeDesignToken,
): input is ColorTokensBrueckeDesignToken {
  return input.$type === 'color';
}
