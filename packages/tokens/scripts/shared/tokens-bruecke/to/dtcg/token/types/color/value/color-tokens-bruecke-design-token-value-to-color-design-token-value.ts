import Color from 'colorjs.io';
import { isCurlyReference } from '../../../../../../../dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../../dtcg/design-token/token/types/base/types/color/value/color-design-token-value.ts';
import { colorDesignTokenValueFromColorJs } from '../../../../../../../dtcg/design-token/token/types/base/types/color/value/from/colorjs/color-design-token-value-from-color-js.ts';
import type { ColorTokensBrueckeDesignTokenValue } from '../../../../../../tokens-bruecke/token/types/color/value/color-tokens-bruecke-design-token-value.ts';
import { isStringColorTokensBrueckeDesignTokenValue } from '../../../../../../tokens-bruecke/token/types/color/value/types/string/is-string-color-tokens-bruecke-design-token-value.ts';

export function colorTokensBrueckeDesignTokenValueToColorDesignTokenValue(
  input: ColorTokensBrueckeDesignTokenValue,
): ColorDesignTokenValue {
  if (isStringColorTokensBrueckeDesignTokenValue(input)) {
    return colorDesignTokenValueFromColorJs(new Color(input));
  } else {
    if (isCurlyReference(input.components)) {
      return {
        // NOTE: TokensBruecke does not expose the `colorSpace`, thus we default to srgb
        colorSpace: 'srgb',
        components: input.components,
        alpha: input.alpha,
      };
    } else {
      const color: ColorDesignTokenValue = colorDesignTokenValueFromColorJs(
        new Color(input.components),
      );

      return {
        colorSpace: color.colorSpace,
        components: color.components,
        alpha: input.alpha,
      };
    }
  }
}
