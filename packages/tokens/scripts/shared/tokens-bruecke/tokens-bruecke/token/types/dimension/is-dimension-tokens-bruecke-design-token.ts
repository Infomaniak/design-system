import type { GenericTokensBrueckeDesignToken } from '../../generic-tokens-bruecke-design-token.ts';
import type { DimensionTokensBrueckeDesignToken } from './dimension-tokens-bruecke-design-token.ts';

export function isDimensionTokensBrueckeDesignToken(
  input: GenericTokensBrueckeDesignToken,
): input is DimensionTokensBrueckeDesignToken {
  return input.$type === 'dimension';
}
