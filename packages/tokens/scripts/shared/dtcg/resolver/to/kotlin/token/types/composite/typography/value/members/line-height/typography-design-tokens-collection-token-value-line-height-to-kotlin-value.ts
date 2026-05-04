import { isNumberTypographyDesignTokenValueLineHeight } from '../../../../../../../../../../design-token/token/types/composite/types/typography/value/members/line-height/types/number/is-number-typography-design-token-value-line-height.ts';
import type { TypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../../../../token/types/composite/typography/value/members/line-height/typography-design-tokens-collection-token-value-line-height.ts';
import type { KotlinVariableDeclarationDpValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/dp/kotlin-variable-declaration-dp-value.ts';
import type { KotlinVariableDeclarationFloatValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/float/kotlin-variable-declaration-float-value.ts';
import type { KotlinVariableDeclarationTextUnitValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/text-unit/kotlin-variable-declaration-text-unit-value.ts';

import { dimensionTypographyDesignTokensCollectionTokenValueLineHeightToKotlinValue } from './types/dimension/dimension-typography-design-tokens-collection-token-value-line-height-to-kotlin-value.ts';
import { numberTypographyDesignTokensCollectionTokenValueLineHeightToKotlinValue } from './types/number/number-typography-design-tokens-collection-token-value-line-height-to-kotlin-value.ts';

export function typographyDesignTokensCollectionTokenValueLineHeightToKotlinValue(
  value: TypographyDesignTokensCollectionTokenValueLineHeight,
):
  | KotlinVariableDeclarationFloatValue
  | KotlinVariableDeclarationDpValue
  | KotlinVariableDeclarationTextUnitValue {
  return isNumberTypographyDesignTokenValueLineHeight(value)
    ? numberTypographyDesignTokensCollectionTokenValueLineHeightToKotlinValue(value)
    : dimensionTypographyDesignTokensCollectionTokenValueLineHeightToKotlinValue(value);
}
