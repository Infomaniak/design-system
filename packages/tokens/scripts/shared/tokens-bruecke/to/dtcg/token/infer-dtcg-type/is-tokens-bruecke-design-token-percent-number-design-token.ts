import type { GenericTokensBrueckeDesignToken } from '../../../../tokens-bruecke/token/generic-tokens-bruecke-design-token.ts';
import type { TokensBrueckeToDtcgContext } from '../../context/tokens-bruecke-to-dtcg-context.ts';

export function isTokensBrueckeDesignTokenPercentNumberDesignToken(
  input: GenericTokensBrueckeDesignToken,
  ctx: TokensBrueckeToDtcgContext,
): boolean {
  return (
    ctx.path.join('.').includes('opacity') ||
    (input.scopes !== undefined && input.scopes.includes('OPACITY'))
  );
}
