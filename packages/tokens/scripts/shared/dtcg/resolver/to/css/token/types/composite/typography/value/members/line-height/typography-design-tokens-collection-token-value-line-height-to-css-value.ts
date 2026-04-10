import { isNumberTypographyDesignTokenValueLineHeight } from '../../../../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/number/is-number-typography-design-token-value-line-height.ts';
import type { TypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../../../../token/types/composite/typography/value/members/line-height/typography-design-tokens-collection-token-value-line-height.ts';
import { dimensionTypographyDesignTokensCollectionTokenValueLineHeightToCssValue } from './types/dimension/dimension-typography-design-tokens-collection-token-value-line-height-to-css-value.ts';
import { numberTypographyDesignTokensCollectionTokenValueLineHeightToCssValue } from './types/number/number-typography-design-tokens-collection-token-value-line-height-to-css-value.ts';

export function typographyDesignTokensCollectionTokenValueLineHeightToCssValue(
  value: TypographyDesignTokensCollectionTokenValueLineHeight,
): string {
  return isNumberTypographyDesignTokenValueLineHeight(value)
    ? numberTypographyDesignTokensCollectionTokenValueLineHeightToCssValue(value)
    : dimensionTypographyDesignTokensCollectionTokenValueLineHeightToCssValue(value);
}
