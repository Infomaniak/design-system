import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import type { CurlyReference } from '../../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../../misc/curly-reference/is-curly-reference.ts';
import type { CssContext } from '../../css-context.ts';
import { curlyReferenceToCssValue } from '../../references/curly-reference-to-css-value.ts';

export type CubicBezierDesignTokenValue = [number, number, number, number];

export function isCubicBezierDesignTokenValue(
  input: unknown,
): input is CubicBezierDesignTokenValue {
  return (
    Array.isArray(input) && input.every((item: unknown): item is number => typeof item === 'number')
  );
}

export function isCubicBezierDesignTokenValueOrCurlyReference(
  input: unknown,
): input is CubicBezierDesignTokenValue | CurlyReference {
  return isCubicBezierDesignTokenValue(input) || isCurlyReference(input);
}

export function cubicBezierDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isCubicBezierDesignTokenValue($value)) {
    throw new Error('Invalid cubicBezier value.');
  }

  return `cubic-bezier(${$value.map((item: number): string => item.toString(10)).join(', ')})`;
}

export const DTCG_CUBIC_BEZIER_CSS = 'dtcg/cubic-bezier/css';

export function registerDtcgCubicBezierCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_CUBIC_BEZIER_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'cubicBezier';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return cubicBezierDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
