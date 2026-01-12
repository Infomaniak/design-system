import type { Coords } from 'colorjs.io';
import Color from 'colorjs.io';
import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isObject } from '../../../../../../../../../scripts/helpers/misc/is-object.ts';
import type { CurlyReference } from '../../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../../misc/curly-reference/is-curly-reference.ts';
import { isJsonReference } from '../../../../../misc/json-reference/is-json-reference.ts';
import type { CssContext } from '../../css-context.ts';
import { curlyReferenceToCssValue } from '../../references/curly-reference-to-css-value.ts';

export type ColorDesignTokenColorSpace =
  | 'srgb'
  | 'srgb-linear'
  | 'hsl'
  | 'hwb'
  | 'lab'
  | 'lch'
  | 'oklab'
  | 'oklch'
  | 'display-p3'
  | 'a98-rgb'
  | 'prophoto-rgb'
  | 'rec2020'
  | 'xyz-d65'
  | 'xyz-d50';

export type ColorDesignTokenValueComponent = number | 'none';

export interface ColorDesignTokenValue {
  readonly colorSpace: ColorDesignTokenColorSpace;
  readonly components: readonly ColorDesignTokenValueComponent[];
  readonly alpha?: number;
  readonly hey?: string;
}

export function isColorDesignTokenValue(input: unknown): input is ColorDesignTokenValue {
  return (
    isObject(input) &&
    typeof Reflect.get(input, 'colorSpace') === 'string' &&
    Array.isArray(Reflect.get(input, 'components')) &&
    (typeof Reflect.get(input, 'alpha') === 'number' || Reflect.get(input, 'alpha') === undefined)
  );
}

export function isColorDesignTokenValueOrCurlyReference(
  input: unknown,
): input is ColorDesignTokenValue | CurlyReference {
  return isColorDesignTokenValue(input) || isCurlyReference(input);
}

export function colorDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isColorDesignTokenValue($value)) {
    throw new Error('Invalid color value.');
  }

  const { colorSpace, components, alpha } = $value;

  if (isJsonReference(colorSpace) || isJsonReference(components) || isJsonReference(alpha)) {
    throw new Error('References are not supported yet.');
  }

  return new Color({
    space: colorSpace,
    coords: components.map((component: ColorDesignTokenValueComponent): number | null => {
      return component === 'none' ? null : component;
    }) as Coords,
    alpha,
  }).toString({
    format: 'hex',
  });
}

export const DTCG_COLOR_CSS = 'dtcg/color/css';

export function registerDtcgColorCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_COLOR_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'color';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return colorDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
