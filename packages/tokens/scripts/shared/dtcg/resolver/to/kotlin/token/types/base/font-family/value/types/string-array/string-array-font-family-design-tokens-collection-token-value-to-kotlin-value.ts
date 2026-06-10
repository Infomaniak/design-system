import type { StringArrayFontFamilyDesignTokensCollectionTokenValue } from '../../../../../../../../../token/types/base/font-family/value/types/string-array/string-array-font-family-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationListOfFontFamilyValue } from '../../../../../../../kotlin-variable-declaration/value/built-in/list-of-font-family/kotlin-variable-declaration-list-of-font-family-value.ts';
import { stringFontFamilyDesignTokenValueToKotlinValue } from '../string/string-font-family-design-token-value-to-kotlin-value.ts';

export function stringArrayFontFamilyDesignTokensCollectionTokenValueToKotlinValue(
  value: StringArrayFontFamilyDesignTokensCollectionTokenValue,
): KotlinVariableDeclarationListOfFontFamilyValue {
  return {
    type: 'List<FontFamily>',
    value: `listOf<FontFamily>(${value
      .map((value: string): string => {
        return stringFontFamilyDesignTokenValueToKotlinValue(value).value;
      })
      .join(', ')})`,
  };
}
