import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/update/update-value-or-curly-reference.ts';
import type { TransitionDesignTokensCollectionTokenValue } from '../transition-design-tokens-collection-token-value.ts';

export function updateTransitionDesignTokensCollectionTokenValueReferences(
  value: TransitionDesignTokensCollectionTokenValue,
  update: UpdateCurlyReference,
): TransitionDesignTokensCollectionTokenValue {
  return {
    duration: updateValueOrCurlyReference(value.duration, update),
    delay: updateValueOrCurlyReference(value.delay, update),
    timingFunction: updateValueOrCurlyReference(value.timingFunction, update),
  };
}
