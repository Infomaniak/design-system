import type { TransitionDesignTokensCollectionTokenValue } from '../../../../../../../token/types/composite/transition/value/transition-design-tokens-collection-token-value.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import { cubicBezierDesignTokensCollectionTokenValueToCssValue } from '../../../base/cubic-bezier/value/cubic-bezier-design-tokens-collection-token-value-to-css-value.ts';
import { durationDesignTokensCollectionTokenValueToCssValue } from '../../../base/duration/value/duration-design-tokens-collection-token-value-to-css-value.ts';

export interface TransitionDesignTokensCollectionTokenValueToCssValueOptions extends ValueOrCurlyReferenceToCssVariableReferenceOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition
 */
export function transitionDesignTokensCollectionTokenValueToCssValue(
  value: TransitionDesignTokensCollectionTokenValue,
  options?: TransitionDesignTokensCollectionTokenValueToCssValueOptions,
): string {
  return `${valueOrCurlyReferenceToCssVariableReference(value.duration, durationDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.timingFunction, cubicBezierDesignTokensCollectionTokenValueToCssValue, options)} ${valueOrCurlyReferenceToCssVariableReference(value.duration, durationDesignTokensCollectionTokenValueToCssValue, options)}`;
}
