import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { designTokenReferenceSchema } from '../../../../../dtcg/design-token/reference/design-token-reference.schema.ts';
import type { DesignTokenReference } from '../../../../../dtcg/design-token/reference/design-token-reference.ts';
import { transitionDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/composite/types/transition/value/transition-design-token-value.schema.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';
import { cubicBezierDesignTokenValueToCssValue } from '../base/cubic-bezier.ts';
import { durationDesignTokenValueToCssValue } from '../base/duration.ts';

export function transitionDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (designTokenReferenceSchema.safeParse($value).success) {
    return designTokenReferenceToCssValue($value as DesignTokenReference, ctx);
  }

  const { duration, delay, timingFunction } = transitionDesignTokenValueSchema.parse($value);

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
