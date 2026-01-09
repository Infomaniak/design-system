import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import type { CssContext } from '../../../../misc/css-context.ts';
import type { CurlyReference } from '../../../../misc/curly-reference/curly-reference.ts';
import { isCurlyReference } from '../../../../misc/curly-reference/is-curly-reference.ts';
import { curlyReferenceToCssValue } from '../../../../misc/curly-reference/operations/curly-reference-to-css-value.ts';
import { isObject } from '../../../../misc/is-object.ts';
import { isJsonReference } from '../../../../misc/json-reference/is-json-reference.ts';

export interface DurationDesignTokenValue {
  readonly value: number;
  readonly unit: DurationDesignTokenValueUnit;
}

export type DurationDesignTokenValueUnit = 's' | 'ms';

export function isDurationDesignTokenValue(input: unknown): input is DurationDesignTokenValue {
  return (
    isObject(input) &&
    typeof Reflect.get(input, 'value') === 'number' &&
    typeof Reflect.get(input, 'unit') === 'string'
  );
}

export function isDurationDesignTokenValueOrCurlyReference(
  input: unknown,
): input is DurationDesignTokenValue | CurlyReference {
  return isDurationDesignTokenValue(input) || isCurlyReference(input);
}

export function durationDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isDurationDesignTokenValue($value)) {
    throw new Error('Invalid duration value.');
  }

  const { value, unit } = $value;

  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('References are not supported yet.');
  }

  return `${value}${unit}`;
}

export const DTCG_DURATION_CSS = 'dtcg/duration/css';

export function registerDtcgDurationCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_DURATION_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'duration';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return durationDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
