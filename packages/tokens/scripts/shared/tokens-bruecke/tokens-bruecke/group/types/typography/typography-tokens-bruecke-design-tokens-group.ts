import type { DimensionTokensBrueckeDesignToken } from '../../../token/types/dimension/dimension-tokens-bruecke-design-token.ts';
import type { StringTokensBrueckeDesignToken } from '../../../token/types/string/string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../tokens-bruecke-design-tokens-group.ts';

export interface TypographyTokensBrueckeDesignTokensGroup extends TokensBrueckeDesignTokensGroup {
  readonly fontFamily: StringTokensBrueckeDesignToken;
  readonly fontSize: DimensionTokensBrueckeDesignToken;
  readonly fontWeight: StringTokensBrueckeDesignToken;
  readonly letterSpacing: DimensionTokensBrueckeDesignToken;
  readonly lineHeight: DimensionTokensBrueckeDesignToken;
}
