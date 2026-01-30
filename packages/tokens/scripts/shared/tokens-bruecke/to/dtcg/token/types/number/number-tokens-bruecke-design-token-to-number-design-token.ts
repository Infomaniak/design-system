import type { NumberDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/number/number-design-token.ts';
import type { NumberTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/number/number-tokens-bruecke-design-token.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';
import { numberTokensBrueckeDesignTokenValueToNumberDesignTokenValue } from './value/number-tokens-bruecke-design-token-value-to-number-design-token-value.ts';

export function numberTokensBrueckeDesignTokenToNumberDesignToken(
  input: NumberTokensBrueckeDesignToken,
): NumberDesignToken {
  return tokensBrueckeDesignTokenWithMapValueToDesignToken(
    input,
    'number',
    numberTokensBrueckeDesignTokenValueToNumberDesignTokenValue,
  );
}
