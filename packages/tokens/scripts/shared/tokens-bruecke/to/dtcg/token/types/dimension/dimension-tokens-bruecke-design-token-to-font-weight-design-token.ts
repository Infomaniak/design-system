import type { FontWeightDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import type { DimensionTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';
import { dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue } from './value/dimension-tokens-bruecke-design-token-value-to-dimension-design-token-value.ts';

export function dimensionTokensBrueckeDesignTokenToFontWeightDesignToken(
  input: DimensionTokensBrueckeDesignToken,
  _ctx: TokensBrueckeToDtcgContext,
): FontWeightDesignToken {
  return tokensBrueckeDesignTokenWithMapValueToDesignToken(
    input,
    'fontWeight',
    (value: string): number => {
      return dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue(value)
        .value as number;
    },
  );
}
