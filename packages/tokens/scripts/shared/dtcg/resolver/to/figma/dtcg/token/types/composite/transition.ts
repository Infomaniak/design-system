import type { ResolvedDesignTokensCollectionToken } from '../../../../../../token/design-tokens-collection-token.ts';
import type { TransitionDesignTokensCollectionTokenValue } from '../../../../../../token/types/composite/transition/value/transition-design-tokens-collection-token-value.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import { durationDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/duration.ts';

export function transitionDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: ResolvedDesignTokensCollectionToken<
    'transition',
    TransitionDesignTokensCollectionTokenValue
  >,
): FigmaDesignTokensGroup {
  console.warn('timingFunction skipped');

  return {
    duration: durationDesignTokensCollectionTokenToNumberFigmaDesignToken({
      ...token,
      type: 'duration',
      value: token.value.duration,
    }),
    delay: durationDesignTokensCollectionTokenToNumberFigmaDesignToken({
      ...token,
      type: 'duration',
      value: token.value.duration,
    }),
  };
}
