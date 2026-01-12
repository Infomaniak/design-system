import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isObject } from '../../../../../../../../../../scripts/helpers/misc/is-object.ts';
import type { CurlyReference } from '../../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../../misc/curly-reference/is-curly-reference.ts';
import { isJsonReference } from '../../../../../misc/json-reference/is-json-reference.ts';
import type { CssContext } from '../../css-context.ts';
import { curlyReferenceToCssValue } from '../../references/curly-reference-to-css-value.ts';
import { strokeStyleDesignTokenValueDashArrayToCssValue } from '../composite/stroke-style.ts';

export interface DimensionDesignTokenValue {
  readonly value: number;
  readonly unit: DimensionDesignTokenValueUnit;
}

export type DimensionDesignTokenValueUnit = 'px' | 'rem';

export function isDimensionDesignTokenValue(input: unknown): input is DimensionDesignTokenValue {
  return (
    isObject(input) &&
    typeof Reflect.get(input, 'value') === 'number' &&
    typeof Reflect.get(input, 'unit') === 'string'
  );
}

export function isDimensionDesignTokenValueOrCurlyReference(
  input: unknown,
): input is DimensionDesignTokenValue | CurlyReference {
  return isDimensionDesignTokenValue(input) || isCurlyReference(input);
}

export function dimensionDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isDimensionDesignTokenValue($value)) {
    throw new Error('Invalid dimension value.');
  }

  const { value, unit } = $value;

  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('References are not supported yet.');
  }

  return `${value}${unit}`;
}

export const DTCG_DIMENSION_CSS = 'dtcg/dimension/css';

export function registerDtcgDimensionCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_DIMENSION_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'dimension';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      if (Array.isArray(token.$value)) {
        return strokeStyleDesignTokenValueDashArrayToCssValue(token.$value);
      }

      return dimensionDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
