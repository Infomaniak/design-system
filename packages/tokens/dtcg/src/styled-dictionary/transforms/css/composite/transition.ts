import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import type { CssContext } from '../../../../misc/css-context.ts';
import { isCurlyReference } from '../../../../misc/curly-reference/is-curly-reference.ts';
import { curlyReferenceToCssValue } from '../../../../misc/curly-reference/operations/curly-reference-to-css-value.ts';
import { isObject } from '../../../../misc/is-object.ts';
import { isJsonReference } from '../../../../misc/json-reference/is-json-reference.ts';
import {
  type CubicBezierDesignTokenValue,
  cubicBezierDesignTokenValueToCssValue,
  isCubicBezierDesignTokenValueOrCurlyReference,
} from '../base/cubic-bezier.ts';
import {
  type DurationDesignTokenValue,
  durationDesignTokenValueToCssValue,
  isDurationDesignTokenValueOrCurlyReference,
} from '../base/duration.ts';

export interface TransitionDesignTokenValue {
  readonly duration: DurationDesignTokenValue;
  readonly delay: DurationDesignTokenValue;
  readonly timingFunction: CubicBezierDesignTokenValue;
}

export function isTransitionDesignTokenValue(input: unknown): input is TransitionDesignTokenValue {
  return (
    isObject(input) &&
    isDurationDesignTokenValueOrCurlyReference(Reflect.get(input, 'duration')) &&
    isDurationDesignTokenValueOrCurlyReference(Reflect.get(input, 'delay')) &&
    isCubicBezierDesignTokenValueOrCurlyReference(Reflect.get(input, 'timingFunction'))
  );
}

export function transitionDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isCurlyReference($value)) {
    return curlyReferenceToCssValue($value, ctx);
  }

  if (!isTransitionDesignTokenValue($value)) {
    throw new Error('Invalid transition value.');
  }

  const { duration, delay, timingFunction } = $value;

  if (isJsonReference(duration) || isJsonReference(delay) || isJsonReference(timingFunction)) {
    throw new Error('References are not supported yet.');
  }

  return `${durationDesignTokenValueToCssValue(duration, ctx)} ${cubicBezierDesignTokenValueToCssValue(timingFunction, ctx)} ${durationDesignTokenValueToCssValue(delay, ctx)}`;
}

export const DTCG_TRANSITION_CSS = 'dtcg/transition/css';

export function registerDtcgTransitionCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_TRANSITION_CSS,
    type: transformTypes.value,
    transitive: true,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'transition';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return transitionDesignTokenValueToCssValue(token.original.$value, ctx);
    },
  });
}
