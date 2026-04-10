import type { NumberTypographyDesignTokenValueLineHeight } from '../../../../../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/number/number-typography-design-token-value-line-height.ts';
import { numberDesignTokenValueToNumberDesignTokensCollectionTokenValue } from '../../../../../../../../base/number/value/from/number-design-token-value-to-number-design-tokens-collection-token-value.ts';
import type { NumberTypographyDesignTokensCollectionTokenValueLineHeight } from '../number-typography-design-tokens-collection-token-value-line-height.ts';

export function numberTypographyDesignTokenValueLineHeightToNumberTypographyDesignTokensCollectionTokenValueLineHeight(
  value: NumberTypographyDesignTokenValueLineHeight,
  root: unknown,
): NumberTypographyDesignTokensCollectionTokenValueLineHeight {
  return numberDesignTokenValueToNumberDesignTokensCollectionTokenValue(value, root);
}
