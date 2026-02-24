import type { DimensionDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/dimension/dimension-design-token.ts';
import type { DimensionTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';
import { dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue } from './value/dimension-tokens-bruecke-design-token-value-to-dimension-design-token-value.ts';

export function dimensionTokensBrueckeDesignTokenToDimensionDesignToken(
  input: DimensionTokensBrueckeDesignToken,
  _ctx: TokensBrueckeToDtcgContext,
): DimensionDesignToken {
  return tokensBrueckeDesignTokenWithMapValueToDesignToken(
    input,
    'dimension',
    dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue,
  );
}
