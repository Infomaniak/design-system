import type { TokensBrueckeDesignToken } from '../../tokens-bruecke-design-token.ts';
import type { NumberTokensBrueckeDesignTokenValue } from './value/number-tokens-bruecke-design-token-value.ts';

export type NumberTokensBrueckeDesignToken = TokensBrueckeDesignToken<
  'number',
  NumberTokensBrueckeDesignTokenValue
>;
