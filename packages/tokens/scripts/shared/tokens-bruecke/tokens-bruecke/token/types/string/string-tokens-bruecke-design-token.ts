import type { TokensBrueckeDesignToken } from '../../tokens-bruecke-design-token.ts';
import type { StringTokensBrueckeDesignTokenValue } from './value/string-tokens-bruecke-design-token-value.ts';

export type StringTokensBrueckeDesignToken = TokensBrueckeDesignToken<
  'string',
  StringTokensBrueckeDesignTokenValue
>;
