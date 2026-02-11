import type { GenericDesignToken } from '../../../../../../dtcg/design-token/token/generic-design-token.ts';
import type { FontWeightDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import type { FontWeightDesignTokenValue } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/value/font-weight-design-token-value.ts';
import { isNumberFontWeightDesignTokenValue } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/number/is-number-font-weight-design-token-value.ts';
import { isPredefinedFontWeightDesignTokenValue } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/predefined/is-predefined-font-weight-design-token-value.ts';
import type { StringTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { isTokensBrueckeDesignTokenFontFamilyDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-family-design-token.ts';
import { isTokensBrueckeDesignTokenFontStyleDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-style-design-token.ts';
import { isTokensBrueckeDesignTokenFontWeightDesignToken } from '../../infer-dtcg-type/is-tokens-bruecke-design-token-font-weight-design-token.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';

export function stringTokensBrueckeDesignTokenToDesignToken(
  input: StringTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): GenericDesignToken | FontWeightDesignToken {
  if (isTokensBrueckeDesignTokenFontFamilyDesignToken(input, ctx)) {
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'fontFamily',
      (value: string): string => {
        return value;
      },
    );
  } else if (isTokensBrueckeDesignTokenFontStyleDesignToken(input, ctx)) {
    console.warn('fontStyle are not supported.');
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'fontStyle',
      (value: string): string => {
        return value;
      },
    );
  } else if (isTokensBrueckeDesignTokenFontWeightDesignToken(input, ctx)) {
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'fontWeight',
      (value: string): FontWeightDesignTokenValue => {
        if (isPredefinedFontWeightDesignTokenValue(value)) {
          return value;
        } else {
          const valueAsNumber: number = Number(value);
          if (isNumberFontWeightDesignTokenValue(valueAsNumber)) {
            return valueAsNumber;
          }
          throw new Error(`[${ctx.path.join('.')}] - Unable to transform "${value}" value`);
        }
      },
    );
  } else {
    throw new Error(`[${ctx.path.join('.')}] - Unable to transform "string" type`);
  }
}
