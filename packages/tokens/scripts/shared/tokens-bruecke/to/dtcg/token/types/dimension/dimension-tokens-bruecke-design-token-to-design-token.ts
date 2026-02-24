import type { DimensionDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/dimension/dimension-design-token.ts';
import type { FontWeightDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import type { NumberDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/number/number-design-token.ts';
import type { DimensionTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { isTokensBrueckeDesignTokenFontWeightDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-weight-design-token.ts';
import { isTokensBrueckeDesignTokenNumberDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-number-design-token.ts';
import { dimensionTokensBrueckeDesignTokenToDimensionDesignToken } from './dimension-tokens-bruecke-design-token-to-dimension-design-token.ts';
import { dimensionTokensBrueckeDesignTokenToFontWeightDesignToken } from './dimension-tokens-bruecke-design-token-to-font-weight-design-token.ts';
import { dimensionTokensBrueckeDesignTokenToNumberDesignToken } from './dimension-tokens-bruecke-design-token-to-number-design-token.ts';

export function dimensionTokensBrueckeDesignTokenToDesignToken(
  input: DimensionTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): DimensionDesignToken | NumberDesignToken | FontWeightDesignToken {
  if (isTokensBrueckeDesignTokenNumberDesignToken(input, ctx)) {
    return dimensionTokensBrueckeDesignTokenToNumberDesignToken(input, ctx);
  } else if (isTokensBrueckeDesignTokenFontWeightDesignToken(input, ctx)) {
    return dimensionTokensBrueckeDesignTokenToFontWeightDesignToken(input, ctx);
  } else {
    return dimensionTokensBrueckeDesignTokenToDimensionDesignToken(input, ctx);
  }
}
