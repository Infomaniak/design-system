import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isObject } from '../../../../../../../../../scripts/helpers/misc/is-object.ts';
import { isCurlyReference } from '../../../../../misc/curly-reference/is-curly-reference.ts';
import { isJsonReference } from '../../../../../misc/json-reference/is-json-reference.ts';
import type { CssContext } from '../../css-context.ts';
import { curlyReferenceToCssValue } from '../../references/curly-reference-to-css-value.ts';
import {
  type DimensionDesignTokenValue,
  dimensionDesignTokenValueToCssValue,
  isDimensionDesignTokenValueOrCurlyReference,
} from '../base/dimension.ts';
import {
  type FontFamilyDesignTokenValue,
  fontFamilyDesignTokenValueToCssValue,
  isFontFamilyDesignTokenValueOrCurlyReference,
} from '../base/font-family.ts';
import {
  type FontWeightDesignTokenValue,
  fontWeightDesignTokenValueToCssValue,
  isFontWeightDesignTokenValueOrCurlyReference,
} from '../base/font-weight.ts';
import {
  isNumberDesignTokenValueOrCurlyReference,
  type NumberDesignTokenValue,
  numberDesignTokenValueToCssValue,
} from '../base/number.ts';

export interface TypographyDesignTokenValue {
  readonly fontFamily: FontFamilyDesignTokenValue;
  readonly fontSize: DimensionDesignTokenValue;
  readonly fontWeight: FontWeightDesignTokenValue;
  readonly letterSpacing: DimensionDesignTokenValue;
  readonly lineHeight: NumberDesignTokenValue;
}

export function isTypographyDesignTokenValue(input: unknown): input is TypographyDesignTokenValue {
  return (
    isObject(input) &&
    isFontFamilyDesignTokenValueOrCurlyReference(Reflect.get(input, 'fontFamily')) &&
    isDimensionDesignTokenValueOrCurlyReference(Reflect.get(input, 'fontSize')) &&
    isFontWeightDesignTokenValueOrCurlyReference(Reflect.get(input, 'fontWeight')) &&
    isDimensionDesignTokenValueOrCurlyReference(Reflect.get(input, 'letterSpacing')) &&
    isNumberDesignTokenValueOrCurlyReference(Reflect.get(input, 'lineHeight'))
  );
}

export function typographyDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isTypographyDesignTokenValue($value)) {
    throw new Error('Invalid typography value.');
  }

  const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } = $value;

  if (
    isJsonReference(fontFamily) ||
    isJsonReference(fontSize) ||
    isJsonReference(fontWeight) ||
    isJsonReference(letterSpacing) ||
    isJsonReference(lineHeight)
  ) {
    throw new Error('References are not supported yet.');
  }

  return `${fontWeightDesignTokenValueToCssValue(fontWeight, ctx)} ${dimensionDesignTokenValueToCssValue(fontSize, ctx)}/${numberDesignTokenValueToCssValue(lineHeight, ctx)} ${fontFamilyDesignTokenValueToCssValue(fontFamily, ctx)}`;
}

export const DTCG_TYPOGRAPHY_CSS = 'dtcg/typography/css';

export function registerDtcgTypographyCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_TYPOGRAPHY_CSS,
    type: transformTypes.value,
    transitive: true,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'typography';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return typographyDesignTokenValueToCssValue(token.original.$value, ctx);
    },
  });
}
