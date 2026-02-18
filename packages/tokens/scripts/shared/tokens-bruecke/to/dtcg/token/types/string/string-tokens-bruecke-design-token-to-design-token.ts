import type { GenericDesignToken } from '../../../../../../dtcg/design-token/token/generic-design-token.ts';
import type { FontFamilyDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-family/font-family-design-token.ts';
import type { FontWeightDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import type { StringTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { isTokensBrueckeDesignTokenFontFamilyDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-family-design-token.ts';
import { isTokensBrueckeDesignTokenFontStyleDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-style-design-token.ts';
import { isTokensBrueckeDesignTokenFontWeightDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-weight-design-token.ts';
import { stringTokensBrueckeDesignTokenToFontFamilyDesignToken } from './string-tokens-bruecke-design-token-to-font-family-design-token.ts';
import { stringTokensBrueckeDesignTokenToFontStyleDesignToken } from './string-tokens-bruecke-design-token-to-font-style-design-token.ts';
import { stringTokensBrueckeDesignTokenToFontWeightDesignToken } from './string-tokens-bruecke-design-token-to-font-weight-design-token.ts';

export function stringTokensBrueckeDesignTokenToDesignToken(
  input: StringTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): GenericDesignToken | FontFamilyDesignToken | FontWeightDesignToken {
  if (isTokensBrueckeDesignTokenFontFamilyDesignToken(input, ctx)) {
    return stringTokensBrueckeDesignTokenToFontFamilyDesignToken(input, ctx);
  } else if (isTokensBrueckeDesignTokenFontStyleDesignToken(input, ctx)) {
    return stringTokensBrueckeDesignTokenToFontStyleDesignToken(input, ctx);
  } else if (isTokensBrueckeDesignTokenFontWeightDesignToken(input, ctx)) {
    return stringTokensBrueckeDesignTokenToFontWeightDesignToken(input, ctx);
  } else {
    throw new Error(`[${ctx.path.join('.')}] - Unable to transform "string" type`);
  }
}
