import type { StringArrayFontFamilyDesignTokensCollectionTokenValue } from './string-array-font-family-design-tokens-collection-token-value.ts';

export function isStringArrayFontFamilyDesignTokensCollectionTokenValue(
  input: unknown,
): input is StringArrayFontFamilyDesignTokensCollectionTokenValue {
  return (
    Array.isArray(input) && input.every((font: unknown): font is string => typeof font === 'string')
  );
}
