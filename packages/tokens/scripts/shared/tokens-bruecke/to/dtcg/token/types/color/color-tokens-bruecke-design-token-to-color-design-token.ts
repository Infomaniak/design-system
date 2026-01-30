import type { ColorDesignToken } from '../../../../../../dtcg/design-token/token/types/base/types/color/color-design-token.ts';
import type { ColorTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/color/color-tokens-bruecke-design-token.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';
import { colorTokensBrueckeDesignTokenValueToColorDesignTokenValue } from './value/color-tokens-bruecke-design-token-value-to-color-design-token-value.ts';

export function colorTokensBrueckeDesignTokenToColorDesignToken(
  input: ColorTokensBrueckeDesignToken,
): ColorDesignToken {
  return tokensBrueckeDesignTokenWithMapValueToDesignToken(
    input,
    'color',
    colorTokensBrueckeDesignTokenValueToColorDesignTokenValue,
  );
}
