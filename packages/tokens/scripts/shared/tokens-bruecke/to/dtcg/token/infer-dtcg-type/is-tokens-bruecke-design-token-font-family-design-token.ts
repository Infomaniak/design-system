import type { GenericTokensBrueckeDesignToken } from '../../../../tokens-bruecke/token/generic-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../context/tokens-bruecke-to-dtcg-context.ts';

export function isTokensBrueckeDesignTokenFontFamilyDesignToken(
  input: GenericTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): boolean {
  return (
    ctx.path.join('.').includes('font.family') ||
    (input.scopes !== undefined && input.scopes.includes('FONT_FAMILY'))
  );
}
