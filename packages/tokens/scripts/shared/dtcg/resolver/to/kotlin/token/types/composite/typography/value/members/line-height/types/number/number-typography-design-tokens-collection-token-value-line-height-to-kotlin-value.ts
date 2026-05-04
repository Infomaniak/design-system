import type { NumberTypographyDesignTokensCollectionTokenValueLineHeight } from '../../../../../../../../../../../token/types/composite/typography/value/members/line-height/types/number/number-typography-design-tokens-collection-token-value-line-height.ts';
import type { KotlinVariableDeclarationFloatValue } from '../../../../../../../../../kotlin-variable-declaration/value/built-in/float/kotlin-variable-declaration-float-value.ts';
import { numberDesignTokensCollectionTokenValueToKotlinValue } from '../../../../../../../base/number/value/number-design-tokens-collection-token-value-to-kotlin-value.ts';

export function numberTypographyDesignTokensCollectionTokenValueLineHeightToKotlinValue(
  value: NumberTypographyDesignTokensCollectionTokenValueLineHeight,
): KotlinVariableDeclarationFloatValue {
  return numberDesignTokensCollectionTokenValueToKotlinValue(value);
}
