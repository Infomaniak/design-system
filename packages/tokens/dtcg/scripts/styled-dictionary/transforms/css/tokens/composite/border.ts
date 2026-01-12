import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isObject } from '../../../../../../../../../scripts/helpers/misc/is-object.ts';
import type { CurlyReference } from '../../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../../misc/curly-reference/is-curly-reference.ts';
import { isJsonReference } from '../../../../../misc/json-reference/is-json-reference.ts';
import type { CssContext } from '../../css-context.ts';
import { curlyReferenceToCssValue } from '../../references/curly-reference-to-css-value.ts';
import {
  type ColorDesignTokenValue,
  colorDesignTokenValueToCssValue,
  isColorDesignTokenValueOrCurlyReference,
} from '../base/color.ts';
import {
  type DimensionDesignTokenValue,
  dimensionDesignTokenValueToCssValue,
  isDimensionDesignTokenValueOrCurlyReference,
} from '../base/dimension.ts';
import {
  isStrokeStyleDesignTokenValueOrCurlyReference,
  type StrokeStyleDesignTokenValue,
  strokeStyleDesignTokenValueToCssValue,
} from './stroke-style.ts';

export interface BorderDesignTokenValue {
  readonly color: ColorDesignTokenValue | CurlyReference;
  readonly width: DimensionDesignTokenValue | CurlyReference;
  readonly style: StrokeStyleDesignTokenValue | CurlyReference;
}

export function isBorderDesignTokenValue(input: unknown): input is BorderDesignTokenValue {
  return (
    isObject(input) &&
    isColorDesignTokenValueOrCurlyReference(Reflect.get(input, 'color')) &&
    isDimensionDesignTokenValueOrCurlyReference(Reflect.get(input, 'width')) &&
    isStrokeStyleDesignTokenValueOrCurlyReference(Reflect.get(input, 'style'))
  );
}

export function borderDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isBorderDesignTokenValue($value)) {
    throw new Error('Invalid border value.');
  }

  const { color, width, style } = $value;

  if (isJsonReference(color) || isJsonReference(width) || isJsonReference(style)) {
    throw new Error('References are not supported yet.');
  }

  return `${dimensionDesignTokenValueToCssValue(width, ctx)} ${strokeStyleDesignTokenValueToCssValue(style, ctx)} ${colorDesignTokenValueToCssValue(color, ctx)}`;
}

export const DTCG_BORDER_CSS = 'dtcg/border/css';

export function registerDtcgBorderCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_BORDER_CSS,
    type: transformTypes.value,
    transitive: true,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'border';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return borderDesignTokenValueToCssValue(token.original.$value, ctx);
    },
  });
}
