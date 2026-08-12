import type { DimensionDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/dimension/dimension-design-token.ts';
import { convertDimensionDesignTokenValueToRem } from '../../../../../../dtcg/design-token/token/types/base/types/dimension/value/convert/convert-dimension-design-token-value-to-rem.ts';
import type { DimensionDesignTokenValue } from '../../../../../../dtcg/design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { DimensionTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { DimensionTokensBrueckeDesignTokenValue } from '../../../../../tokens-bruecke/token/types/dimension/value/dimension-tokens-bruecke-design-token-value.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { isTokensBrueckeDesignTokenFontSizeDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-size-design-token.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';
import { dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue } from './value/dimension-tokens-bruecke-design-token-value-to-dimension-design-token-value.ts';

export function dimensionTokensBrueckeDesignTokenToDimensionDesignToken(
  input: DimensionTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): DimensionDesignToken {
  return tokensBrueckeDesignTokenWithMapValueToDesignToken(
    input,
    'dimension',
    (value: DimensionTokensBrueckeDesignTokenValue): DimensionDesignTokenValue => {
      let tokenValue: DimensionDesignTokenValue =
        dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue(value);

      if (isTokensBrueckeDesignTokenFontSizeDesignToken(input, ctx)) {
        // convert font-size tokens to rem
        tokenValue = convertDimensionDesignTokenValueToRem(tokenValue);
      }

      return tokenValue;
    },
  );
}
