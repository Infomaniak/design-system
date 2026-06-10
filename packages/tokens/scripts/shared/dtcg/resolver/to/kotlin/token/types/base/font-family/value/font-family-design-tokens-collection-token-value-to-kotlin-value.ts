import { isStringFontFamilyDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/font-family/value/font-family-design-tokens-collection-token-value.ts';
import type { KotlinVariableDeclarationFontFamilyValue } from '../../../../../kotlin-variable-declaration/value/built-in/font-family/kotlin-variable-declaration-font-family-value.ts';
import type { KotlinVariableDeclarationListOfFontFamilyValue } from '../../../../../kotlin-variable-declaration/value/built-in/list-of-font-family/kotlin-variable-declaration-list-of-font-family-value.ts';

import { stringArrayFontFamilyDesignTokensCollectionTokenValueToKotlinValue } from './types/string-array/string-array-font-family-design-tokens-collection-token-value-to-kotlin-value.ts';
import { stringFontFamilyDesignTokenValueToKotlinValue } from './types/string/string-font-family-design-token-value-to-kotlin-value.ts';

export function fontFamilyDesignTokensCollectionTokenValueToKotlinValue(
  value: FontFamilyDesignTokensCollectionTokenValue,
): KotlinVariableDeclarationFontFamilyValue | KotlinVariableDeclarationListOfFontFamilyValue {
  return isStringFontFamilyDesignTokenValue(value)
    ? stringFontFamilyDesignTokenValueToKotlinValue(value)
    : stringArrayFontFamilyDesignTokensCollectionTokenValueToKotlinValue(value);
}
