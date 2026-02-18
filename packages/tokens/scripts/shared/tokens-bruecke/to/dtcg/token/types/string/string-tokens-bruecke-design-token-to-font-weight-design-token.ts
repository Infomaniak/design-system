import type { FontWeightDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import type { FontWeightDesignTokenValue } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/value/font-weight-design-token-value.ts';
import { isNumberFontWeightDesignTokenValue } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/number/is-number-font-weight-design-token-value.ts';
import { isPredefinedFontWeightDesignTokenValue } from '../../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/predefined/is-predefined-font-weight-design-token-value.ts';
import type { StringTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';

export function stringTokensBrueckeDesignTokenToFontWeightDesignToken(
  input: StringTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): FontWeightDesignToken {
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
}
