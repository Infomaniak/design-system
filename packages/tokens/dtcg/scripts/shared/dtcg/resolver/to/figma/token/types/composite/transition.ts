import type { ResolvedDesignTokensCollectionToken } from '../../../../../token/design-tokens-collection-token.ts';
import type { TransitionDesignTokensCollectionTokenValue } from '../../../../../token/types/composite/transition/value/transition-design-tokens-collection-token-value.ts';
import { durationDesignTokensCollectionTokenToFigmaObject } from '../base/duration.ts';

export function transitionDesignTokensCollectionTokenToFigmaObject(
  token: ResolvedDesignTokensCollectionToken<
    'transition',
    TransitionDesignTokensCollectionTokenValue
  >,
): unknown {
  console.warn('timingFunction skipped');

  return {
    duration: durationDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'duration',
      value: token.value.duration,
    }),
    delay: durationDesignTokensCollectionTokenToFigmaObject({
      ...token,
      type: 'duration',
      value: token.value.duration,
    }),
  };
}
