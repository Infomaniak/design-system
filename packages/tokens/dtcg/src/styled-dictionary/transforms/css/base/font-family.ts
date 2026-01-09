import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import type { CssContext } from '../../../../misc/css-context.ts';
import type { CurlyReference } from '../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../misc/curly-reference/is-curly-reference.ts';
import { curlyReferenceToCssValue } from '../../../../misc/curly-reference/operations/curly-reference-to-css-value.ts';

export type FontFamilyDesignTokenValue = string | readonly string[];

export function isFontFamilyDesignTokenValue(input: unknown): input is FontFamilyDesignTokenValue {
  return (
    typeof input === 'string' ||
    (Array.isArray(input) &&
      input.every((item: unknown): item is string => typeof item === 'string'))
  );
}

export function isFontFamilyDesignTokenValueOrCurlyReference(
  input: unknown,
): input is FontFamilyDesignTokenValue | CurlyReference {
  return isFontFamilyDesignTokenValue(input) || isCurlyReference(input);
}

export function fontFamilyDesignTokenValueFontToCssValue(input: string): string {
  return input.includes(' ') ? JSON.stringify(input) : input;
}

export function fontFamilyDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isFontFamilyDesignTokenValue($value)) {
    throw new Error('Invalid fontFamily value.');
  }

  if (typeof $value === 'string') {
    return fontFamilyDesignTokenValueFontToCssValue($value);
  } else {
    return $value.map(fontFamilyDesignTokenValueFontToCssValue).join(', ');
  }
}

export const DTCG_FONT_FAMILY_CSS = 'dtcg/font-family/css';

export function registerDtcgFontFamilyCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_FONT_FAMILY_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'fontFamily';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return fontFamilyDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
