import Color from 'colorjs.io';
import type { ColorDesignTokenValue } from '../../../../../../../dtcg/design-token/token/types/base/types/color/value/color-design-token-value.ts';
import { colorDesignTokenValueFromColorJs } from '../../../../../../../dtcg/design-token/token/types/base/types/color/value/from/colorjs/color-design-token-value-from-color-js.ts';
import type { ColorTokensBrueckeDesignTokenValue } from '../../../../../../tokens-bruecke/token/types/color/value/color-tokens-bruecke-design-token-value.ts';

export function colorTokensBrueckeDesignTokenValueToColorDesignTokenValue(
  input: ColorTokensBrueckeDesignTokenValue,
): ColorDesignTokenValue {
  return colorDesignTokenValueFromColorJs(new Color(input));
}
