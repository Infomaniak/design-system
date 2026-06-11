import type { DimensionTypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../../../../../../token/types/composite/typography/value/members/line-height/types/dimension/dimension-typography-design-tokens-collection-token-value-line-height.ts';
import type { KotlinVariableDeclarationDpValue } from '../../../../../../../../../kotlin-variable-declaration/value/built-in/dp/kotlin-variable-declaration-dp-value.ts';
import type { KotlinVariableDeclarationTextUnitValue } from '../../../../../../../../../kotlin-variable-declaration/value/built-in/text-unit/kotlin-variable-declaration-text-unit-value.ts';
import { dimensionDesignTokensCollectionTokenValueToKotlinValue } from '../../../../../../../base/dimension/value/dimension-design-tokens-collection-token-value-to-kotlin-value.ts';

/**
 * @deprecated UNOFFICIAL: use with caution
 */
export function dimensionTypographyDesignTokensCollectionTokenValueLineHeightToKotlinValue(
  value: DimensionTypographyDesignTokensCollectionTokenValueLineHeight,
): KotlinVariableDeclarationDpValue | KotlinVariableDeclarationTextUnitValue {
  return dimensionDesignTokensCollectionTokenValueToKotlinValue(value);
}
