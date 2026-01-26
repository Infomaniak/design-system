import { resolveValueOrJsonReference } from '../../../../../../../../../design-token/reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../../../../../design-token/reference/types/json/value-or/value-or-json-reference.ts';
import type { StringArrayFontFamilyDesignTokenValue } from '../../../../../../../../../design-token/token/types/base/types/font-family/value/types/string-array/string-array-font-family-design-token-value.ts';
import type { StringArrayFontFamilyDesignTokensCollectionTokenValue } from '../string-array-font-family-design-tokens-collection-token-value.ts';

export function stringArrayFontFamilyDesignTokenValueToStringArrayFontFamilyDesignTokensCollectionTokenValue(
  value: StringArrayFontFamilyDesignTokenValue,
  root: unknown,
): StringArrayFontFamilyDesignTokensCollectionTokenValue {
  return value.map((component: ValueOrJsonReference<string>): string => {
    return resolveValueOrJsonReference(component, root);
  });
}
