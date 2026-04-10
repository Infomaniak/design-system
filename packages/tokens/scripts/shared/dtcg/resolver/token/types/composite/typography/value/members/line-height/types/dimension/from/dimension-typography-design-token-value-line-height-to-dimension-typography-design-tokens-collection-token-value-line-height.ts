import type { DimensionTypographyDesignTokenValueLineHeight } from '../../../../../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/dimension/dimension-typography-design-token-value-line-height.ts';
import { dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue } from '../../../../../../../../base/dimension/value/from/dimension-design-token-value-to-dimension-design-tokens-collection-token-value.ts';
import type { DimensionTypographyDesignTokensCollectionTokenValueLineHeight } from '../dimension-typography-design-tokens-collection-token-value-line-height.ts';

/**
 * @deprecated UNOFICIAL: use with caution
 */
export function dimensionTypographyDesignTokenValueLineHeightToDimensionTypographyDesignTokensCollectionTokenValueLineHeight(
  value: DimensionTypographyDesignTokenValueLineHeight,
  root: unknown,
): DimensionTypographyDesignTokensCollectionTokenValueLineHeight {
  return dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(value, root);
}
