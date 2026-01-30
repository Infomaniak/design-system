import type { GenericDesignToken } from '../../../../../dtcg/design-token/token/generic-design-token.ts';
import type { DimensionTokensBrueckeDesignToken } from './dimension-tokens-bruecke-design-token.ts';

export function isDimensionTokensBrueckeDesignToken(
  input: GenericDesignToken,
): input is DimensionTokensBrueckeDesignToken {
  return input.$type === 'dimension';
}
