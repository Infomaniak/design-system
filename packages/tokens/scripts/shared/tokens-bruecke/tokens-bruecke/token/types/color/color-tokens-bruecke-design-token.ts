import type { TokensBrueckeDesignToken } from '../../tokens-bruecke-design-token.ts';
import type { ColorTokensBrueckeDesignTokenValue } from './value/color-tokens-bruecke-design-token-value.ts';

export type ColorTokensBrueckeDesignToken = TokensBrueckeDesignToken<
  'color',
  ColorTokensBrueckeDesignTokenValue
>;
