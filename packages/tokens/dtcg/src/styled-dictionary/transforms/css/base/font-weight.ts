import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import type { CssContext } from '../../../../misc/css-context.ts';
import type { CurlyReference } from '../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../misc/curly-reference/is-curly-reference.ts';
import { curlyReferenceToCssValue } from '../../../../misc/curly-reference/operations/curly-reference-to-css-value.ts';

export type FontWeightDesignTokenValue = number | PredefinedFontWeightDesignTokenValue;

export type PredefinedFontWeightDesignTokenValue =
  | 'thin'
  | 'hairline'
  | 'extra-light'
  | 'ultra-light'
  | 'light'
  | 'normal'
  | 'regular'
  | 'book'
  | 'medium'
  | 'semi-bold'
  | 'demi-bold'
  | 'bold'
  | 'extra-bold'
  | 'ultra-bold'
  | 'black'
  | 'heavy'
  | 'extra-black'
  | 'ultra-black';

export function predefinedFontWeightDesignTokenValueToNumberValue(
  value: PredefinedFontWeightDesignTokenValue,
): number {
  switch (value) {
    case 'thin':
    case 'hairline':
      return 100;
    case 'extra-light':
    case 'ultra-light':
      return 200;
    case 'light':
      return 300;
    case 'normal':
    case 'regular':
    case 'book':
      return 400;
    case 'medium':
      return 500;
    case 'semi-bold':
    case 'demi-bold':
      return 600;
    case 'bold':
      return 700;
    case 'extra-bold':
    case 'ultra-bold':
      return 800;
    case 'black':
    case 'heavy':
      return 900;
    case 'extra-black':
    case 'ultra-black':
      return 950;
    default:
      throw new Error(`Unexpected font weight value: ${value}`);
  }
}

export function isFontWeightDesignTokenValue(input: unknown): input is FontWeightDesignTokenValue {
  return typeof input === 'number' || typeof input === 'string';
}

export function isFontWeightDesignTokenValueOrCurlyReference(
  input: unknown,
): input is FontWeightDesignTokenValue | CurlyReference {
  return isFontWeightDesignTokenValue(input) || isCurlyReference(input);
}

export function fontWeightDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isFontWeightDesignTokenValue($value)) {
    throw new Error('Invalid fontWeight value.');
  }

  if (typeof $value === 'string') {
    $value = predefinedFontWeightDesignTokenValueToNumberValue($value);
  }

  return ($value as number).toString(10);
}

export const DTCG_FONT_WEIGHT_CSS = 'dtcg/font-weight/css';

export function registerDtcgFontWeightCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_FONT_WEIGHT_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'fontWeight';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return fontWeightDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
