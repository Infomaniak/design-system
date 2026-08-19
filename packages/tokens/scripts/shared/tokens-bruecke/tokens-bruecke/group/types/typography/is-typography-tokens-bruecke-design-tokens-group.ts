import { isDimensionTokensBrueckeDesignToken } from '../../../token/types/dimension/is-dimension-tokens-bruecke-design-token.ts';
import { isStringTokensBrueckeDesignToken } from '../../../token/types/string/is-string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../tokens-bruecke-design-tokens-group.ts';
import { isCompositeTokensBrueckeDesignTokensGroup } from '../composite/is-composite-tokens-bruecke-design-tokens-group.ts';
import type { TypographyTokensBrueckeDesignTokensGroup } from './typography-tokens-bruecke-design-tokens-group.ts';

export function isTypographyTokensBrueckeDesignTokensGroup(
  input: TokensBrueckeDesignTokensGroup,
): input is TypographyTokensBrueckeDesignTokensGroup {
  return isCompositeTokensBrueckeDesignTokensGroup<TypographyTokensBrueckeDesignTokensGroup>(
    input,
    {
      fontFamily: isStringTokensBrueckeDesignToken,
      fontSize: isDimensionTokensBrueckeDesignToken,
      fontWeight: isDimensionTokensBrueckeDesignToken,
      letterSpacing: isDimensionTokensBrueckeDesignToken,
      lineHeight: isDimensionTokensBrueckeDesignToken,
    },
  );
}
