import type { GenericDesignToken } from '../../../../../../dtcg/design-token/token/generic-design-token.ts';
import type { StringTokensBrueckeDesignToken } from '../../../../../tokens-bruecke/token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../../tokens-bruecke-design-token-with-map-value-to-design-token.ts';

export function stringTokensBrueckeDesignTokenToDesignToken(
  input: StringTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): GenericDesignToken {
  const stringPath: string = ctx.path.join('.');

  if (stringPath.includes('font.family')) {
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'fontFamily',
      (value: string): string => {
        return value;
      },
    );
  } else if (stringPath.includes('font.style')) {
    console.warn('fontStyle are not supported.');
    return tokensBrueckeDesignTokenWithMapValueToDesignToken(
      input,
      'fontStyle',
      (value: string): string => {
        return value;
      },
    );
  } else {
    throw new Error(`[${ctx.path.join('.')}] - Unable to transform "string" type`);
  }
}
