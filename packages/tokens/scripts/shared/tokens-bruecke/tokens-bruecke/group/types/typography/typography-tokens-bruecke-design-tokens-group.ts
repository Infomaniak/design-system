import type { DimensionTokensBrueckeDesignToken } from '../../../token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { StringTokensBrueckeDesignToken } from '../../../token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../tokens-bruecke-design-tokens-group.ts';

export interface TypographyTokensBrueckeDesignTokensGroup extends TokensBrueckeDesignTokensGroup {
  readonly family: StringTokensBrueckeDesignToken;
  readonly weight: DimensionTokensBrueckeDesignToken;
  readonly size: DimensionTokensBrueckeDesignToken;
  readonly 'line-height': DimensionTokensBrueckeDesignToken;
  readonly 'letter-spacing': DimensionTokensBrueckeDesignToken;
}
