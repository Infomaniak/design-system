import type { DimensionTokensBrueckeDesignToken } from '../../../../token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { StringTokensBrueckeDesignToken } from '../../../../token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke-design-tokens-group.ts';

/**
 * @deprecated A _legacy_ representation of a "typography" design token.
 */
export interface LegacyTypographyTokensBrueckeDesignTokensGroup extends TokensBrueckeDesignTokensGroup {
  readonly family: StringTokensBrueckeDesignToken;
  readonly size: DimensionTokensBrueckeDesignToken;
  readonly weight: StringTokensBrueckeDesignToken;
  readonly 'letter-spacing': DimensionTokensBrueckeDesignToken;
  readonly 'line-height': DimensionTokensBrueckeDesignToken;
}
