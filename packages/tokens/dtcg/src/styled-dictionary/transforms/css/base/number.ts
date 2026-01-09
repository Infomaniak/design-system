import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import type { CssContext } from '../../../../misc/css-context.ts';
import type { CurlyReference } from '../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../misc/curly-reference/is-curly-reference.ts';
import { curlyReferenceToCssValue } from '../../../../misc/curly-reference/operations/curly-reference-to-css-value.ts';

export type NumberDesignTokenValue = number;

export function isNumberDesignTokenValue(input: unknown): input is NumberDesignTokenValue {
  return typeof input === 'number';
}

export function isNumberDesignTokenValueOrCurlyReference(
  input: unknown,
): input is NumberDesignTokenValue | CurlyReference {
  return isNumberDesignTokenValue(input) || isCurlyReference(input);
}

export function numberDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isNumberDesignTokenValue($value)) {
    throw new Error('Invalid number value.');
  }

  return $value.toString(10);
}

export const DTCG_NUMBER_CSS = 'dtcg/number/css';

export function registerDtcgNumberCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_NUMBER_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'number';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return numberDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
