import type { GenericTokensBrueckeDesignToken } from '../../../../tokens-bruecke/token/generic-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../context/tokens-bruecke-to-dtcg-context.ts';

export function isTokensBrueckeDesignTokenNumberDesignToken(
  input: GenericTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): boolean {
  return (
    ctx.path.join('.').includes('t1.ratio') ||
    ctx.path.join('.').includes('font.line-height') ||
    (input.scopes !== undefined &&
      (input.scopes.includes('LINE_HEIGHT') || input.scopes.includes('OPACITY')))
  );
}
