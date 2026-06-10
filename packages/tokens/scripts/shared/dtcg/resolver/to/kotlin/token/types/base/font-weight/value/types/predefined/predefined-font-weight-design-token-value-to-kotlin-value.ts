import type { PredefinedFontWeightDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import type { KotlinVariableDeclarationFontWeightValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/font-weight/kotlin-variable-declaration-font-weight-value.ts';
import { numberFontWeightDesignTokenValueToKotlinValue } from '../number/ number-font-weight-design-token-value-to-kotlin-value.ts';

export function predefinedFontWeightDesignTokenValueToKotlinValue(
  value: PredefinedFontWeightDesignTokenValue,
): KotlinVariableDeclarationFontWeightValue {
  return numberFontWeightDesignTokenValueToKotlinValue(
    predefinedFontWeightDesignTokenValueToNumberValue(value),
  );
}
