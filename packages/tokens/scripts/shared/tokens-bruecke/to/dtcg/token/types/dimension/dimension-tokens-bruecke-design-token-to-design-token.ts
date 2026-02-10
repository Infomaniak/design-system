import type { DimensionDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/dimension/dimension-design-token.ts';
import type { FontWeightDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import type { NumberDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/number/number-design-token.ts';
import type { DimensionTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { isTokensBrueckeDesignTokenFontWeightDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-weight-design-token.ts';
import { isTokensBrueckeDesignTokenNumberDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-number-design-token.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';
import { dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue } from './value/dimension-tokens-bruecke-design-token-value-to-dimension-design-token-value.ts';

export function dimensionTokensBrueckeDesignTokenToDesignToken(
  input: DimensionTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): DimensionDesignToken | NumberDesignToken | FontWeightDesignToken {
  if (isTokensBrueckeDesignTokenNumberDesignToken(input, ctx)) {
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'number',
      (value: string): number => {
        return dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue(value)
          .value as number;
      },
    );
  } else if (isTokensBrueckeDesignTokenFontWeightDesignToken(input, ctx)) {
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'fontWeight',
      (value: string): number => {
        return dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue(value)
          .value as number;
      },
    );
  } else {
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'dimension',
      dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue,
    );
  }
}
