import type { GenericDesignToken } from '../../../../dtcg/design-token/token/generic-design-token.ts';
import type { GenericTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/generic-tokens-bruecke-design-token.ts';
import { isColorTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/types/color/is-color-tokens-bruecke-design-token.ts';
import { isDimensionTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/types/dimension/is-dimension-tokens-bruecke-design-token.ts';
import { isNumberTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/types/number/is-number-tokens-bruecke-design-token.ts';
import { isStringTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/types/string/is-string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../context/tokens-bruecke-to-dtcg-context.ts';
import { colorTokensBrueckeDesignTokenToColorDesignToken } from './types/color/color-tokens-bruecke-design-token-to-color-design-token.ts';
import { dimensionTokensBrueckeDesignTokenToDesignToken } from './types/dimension/dimension-tokens-bruecke-design-token-to-design-token.ts';
import { numberTokensBrueckeDesignTokenToNumberDesignToken } from './types/number/number-tokens-bruecke-design-token-to-number-design-token.ts';
import { stringTokensBrueckeDesignTokenToDesignToken } from './types/string/string-tokens-bruecke-design-token-to-design-token.ts';

export function tokensBrueckeDesignTokenToDesignToken(
  input: GenericTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): GenericDesignToken {
  if (isColorTokensBrueckeDesignToken(input)) {
    return colorTokensBrueckeDesignTokenToColorDesignToken(input);
  } else if (isDimensionTokensBrueckeDesignToken(input)) {
    return dimensionTokensBrueckeDesignTokenToDesignToken(input, ctx);
  } else if (isNumberTokensBrueckeDesignToken(input)) {
    return numberTokensBrueckeDesignTokenToNumberDesignToken(input);
  } else if (isStringTokensBrueckeDesignToken(input)) {
    return stringTokensBrueckeDesignTokenToDesignToken(input, ctx);
  } else {
    throw new Error(`[${ctx.path.join('.')}] - Unable to transform "${input.$type}" type`);
  }

  // switch (input.$type) {
  //   case 'string':
  //     return stringTokensBrueckeDesignTokenToDesignToken(input, ctx);
  //   case 'color':
  //   case 'dimension':
  //   case 'fontFamily':
  //   case 'fontWeight':
  //   case 'duration':
  //   case 'cubicBezier':
  //   case 'number':
  //   case 'strokeStyle':
  //   case 'border':
  //   case 'transition':
  //   case 'shadow':
  //   case 'gradient':
  //   case 'typography':
  //   // unofficial
  //   case 'grid':
  //   case 'blur':
  //     return input as GenericDesignToken;
  //   default:
  //     throw new Error(`[${ctx.path.join('.')}] - Unable to transform "${input.$type}" type`);
  // }
}
