import type { FontFamilyDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-family/font-family-design-token.ts';
import type { StringTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';

export function stringTokensBrueckeDesignTokenToFontFamilyDesignToken(
  input: StringTokensBrueckeDesignToken,
  _ctx: TokensBrueckeToDtcgContext,
): FontFamilyDesignToken {
  return tokensBrueckeDesignTokenWithMapValueToDesignToken(
    input,
    'fontFamily',
    (value: string): string => {
      return value;
    },
  );
}
