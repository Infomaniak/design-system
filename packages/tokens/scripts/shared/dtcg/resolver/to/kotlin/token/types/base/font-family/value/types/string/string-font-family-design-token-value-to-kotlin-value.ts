import type { StringFontFamilyDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-family/value/types/string/string-font-family-design-token-value.ts';
import type { KotlinVariableDeclarationFontFamilyValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/font-family/kotlin-variable-declaration-font-family-value.ts';
import { stringFontFamilyDesignTokenValueToKotlinFontFamilyValue } from './string-font-family-design-token-value-to-kotlin-font-family-value.ts';

export function stringFontFamilyDesignTokenValueToKotlinValue(
  value: StringFontFamilyDesignTokenValue,
): KotlinVariableDeclarationFontFamilyValue {
  return {
    type: 'FontFamily',
    value: stringFontFamilyDesignTokenValueToKotlinFontFamilyValue(value),
  };
}
