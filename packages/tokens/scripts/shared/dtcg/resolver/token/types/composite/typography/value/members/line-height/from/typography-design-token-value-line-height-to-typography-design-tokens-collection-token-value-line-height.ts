import { isNumberTypographyDesignTokenValueLineHeight } from '../../../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/number/is-number-typography-design-token-value-line-height.ts';
import type { TypographyDesignTokenValueLineHeight } from '../../../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/typography-design-token-value-line-height.ts';
import { dimensionTypographyDesignTokenValueLineHeightToDimensionTypographyDesignTokensCollectionTokenValueLineHeight } from '../types/dimension/from/dimension-typography-design-token-value-line-height-to-dimension-typography-design-tokens-collection-token-value-line-height.ts';
import { numberTypographyDesignTokenValueLineHeightToNumberTypographyDesignTokensCollectionTokenValueLineHeight } from '../types/number/from/number-typography-design-token-value-line-height-to-number-typography-design-tokens-collection-token-value-line-height.ts';
import type { TypographyDesignTokensCollectionTokenValueLineHeight } from '../typography-design-tokens-collection-token-value-line-height.ts';

export function typographyDesignTokenValueLineHeightToTypographyDesignTokensCollectionTokenValueLineHeight(
  value: TypographyDesignTokenValueLineHeight,
  root: unknown,
): TypographyDesignTokensCollectionTokenValueLineHeight {
  return isNumberTypographyDesignTokenValueLineHeight(value)
    ? numberTypographyDesignTokenValueLineHeightToNumberTypographyDesignTokensCollectionTokenValueLineHeight(
        value,
        root,
      )
    : dimensionTypographyDesignTokenValueLineHeightToDimensionTypographyDesignTokensCollectionTokenValueLineHeight(
        value,
        root,
      );
}
