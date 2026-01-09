import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import type { CssContext } from '../../../../misc/css-context.ts';
import type { CurlyReference } from '../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../misc/curly-reference/is-curly-reference.ts';
import { curlyReferenceToCssValue } from '../../../../misc/curly-reference/operations/curly-reference-to-css-value.ts';
import { isObject } from '../../../../misc/is-object.ts';
import { isJsonReference } from '../../../../misc/json-reference/is-json-reference.ts';
import {
  type DimensionDesignTokenValue,
  dimensionDesignTokenValueToCssValue,
  isDimensionDesignTokenValueOrCurlyReference,
} from '../base/dimension.ts';

export type StrokeStyleDesignTokenValue =
  | PredefinedStrokeStyleDesignTokenValue
  | ObjectStrokeStyleDesignTokenValue;

export type PredefinedStrokeStyleDesignTokenValue =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'outset'
  | 'inset';

export interface ObjectStrokeStyleDesignTokenValue {
  readonly dashArray: StrokeStyleDesignTokenValueDashArray;
  readonly lineCap: StrokeStyleDesignTokenValueLineCap;
}

export type StrokeStyleDesignTokenValueDashArray = readonly (
  | DimensionDesignTokenValue
  | CurlyReference
)[];

export type StrokeStyleDesignTokenValueLineCap = 'round' | 'butt' | 'square';

export function isStrokeStyleDesignTokenValue(
  input: unknown,
): input is StrokeStyleDesignTokenValue {
  return (
    typeof input === 'string' ||
    (isObject(input) &&
      Array.isArray(Reflect.get(input, 'dashArray')) &&
      Reflect.get(input, 'dashArray').every(isDimensionDesignTokenValueOrCurlyReference) &&
      typeof Reflect.get(input, 'lineCap') === 'string')
  );
}

export function isStrokeStyleDesignTokenValueOrCurlyReference(
  input: unknown,
): input is StrokeStyleDesignTokenValue | CurlyReference {
  return isStrokeStyleDesignTokenValue(input) || isCurlyReference(input);
}

export function strokeStyleDesignTokenValueDashArrayToCssValue(
  input: StrokeStyleDesignTokenValueDashArray,
  ctx: CssContext,
): string {
  return input
    .map((value: DimensionDesignTokenValue | CurlyReference): string => {
      return dimensionDesignTokenValueToCssValue(value, ctx);
    })
    .join(', ');
}

export function strokeStyleDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isStrokeStyleDesignTokenValue($value)) {
    throw new Error('Invalid strokeStyle value.');
  }

  if (typeof $value === 'string') {
    return $value;
  } else {
    const { dashArray, lineCap } = $value;

    if (isJsonReference(dashArray) || isJsonReference(lineCap)) {
      throw new Error('References are not supported yet.');
    }

    return `${strokeStyleDesignTokenValueDashArrayToCssValue(dashArray, ctx)} ${lineCap}`;
  }
}

export const DTCG_STROKE_STYLE_CSS = 'dtcg/stroke-style/css';

export function registerDtcgStrokeStyleCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_STROKE_STYLE_CSS,
    type: transformTypes.value,
    transitive: true,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'strokeStyle';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return strokeStyleDesignTokenValueToCssValue(token.original.$value, ctx);
    },
  });
}
