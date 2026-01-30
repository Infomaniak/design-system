import type { TokensBrueckeDesignToken } from '../../tokens-bruecke-design-token.ts';
import type { DimensionTokensBrueckeDesignTokenValue } from './value/dimension-tokens-bruecke-design-token-value.ts';

export type DimensionTokensBrueckeDesignToken = TokensBrueckeDesignToken<
  'dimension',
  DimensionTokensBrueckeDesignTokenValue
>;
