import type { CubicBezierDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { DurationDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/duration/value/duration-design-token-value.ts';
import type { TransitionDesignTokenValue } from '../../../../../../../design-token/token/types/composite/types/transition/value/transition-design-token-value.ts';
import type { CubicBezierDesignTokensCollectionTokenValue } from '../../../../base/cubic-bezier/value/cubic-bezier-design-tokens-collection-token-value.ts';
import { cubicBezierDesignTokenValueToCubicBezierDesignTokensCollectionTokenValue } from '../../../../base/cubic-bezier/value/from/cubic-bezier-design-token-value-to-cubic-bezier-design-tokens-collection-token-value.ts';
import type { DurationDesignTokensCollectionTokenValue } from '../../../../base/duration/value/duration-design-tokens-collection-token-value.ts';
import { durationDesignTokenValueToDurationDesignTokensCollectionTokenValue } from '../../../../base/duration/value/from/duration-design-token-value-to-duration-design-tokens-collection-token-value.ts';
import { valueOrDesignTokenReferenceToMappedValueOrCurlyReference } from '../../../value-or-design-token-reference-to-mapped-value-or-curly-reference.ts';
import type { TransitionDesignTokensCollectionTokenValue } from '../transition-design-tokens-collection-token-value.ts';

export function transitionDesignTokenValueToTransitionDesignTokensCollectionTokenValue(
  $value: TransitionDesignTokenValue,
  root: unknown,
): TransitionDesignTokensCollectionTokenValue {
  return {
    duration: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.duration,
      (value: DurationDesignTokenValue): DurationDesignTokensCollectionTokenValue =>
        durationDesignTokenValueToDurationDesignTokensCollectionTokenValue(value, root),
    ),
    delay: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.delay,
      (value: DurationDesignTokenValue): DurationDesignTokensCollectionTokenValue =>
        durationDesignTokenValueToDurationDesignTokensCollectionTokenValue(value, root),
    ),
    timingFunction: valueOrDesignTokenReferenceToMappedValueOrCurlyReference(
      $value.timingFunction,
      (value: CubicBezierDesignTokenValue): CubicBezierDesignTokensCollectionTokenValue =>
        cubicBezierDesignTokenValueToCubicBezierDesignTokensCollectionTokenValue(value, root),
    ),
  };
}
