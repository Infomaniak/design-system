import type { TransitionDesignTokensCollectionToken } from '../../../../../../token/types/composite/transition/transition-design-tokens-collection-token.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import { generateCompositeDesignTokensCollectionSubToken } from '../../generate-composite-design-tokens-collection-sub-token.ts';
import { durationDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/duration.ts';

export function transitionDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: TransitionDesignTokensCollectionToken,
): FigmaDesignTokensGroup {
  console.warn('timingFunction skipped');

  return {
    duration: durationDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'duration', 'duration'),
    ),
    delay: durationDesignTokensCollectionTokenToNumberFigmaDesignToken(
      generateCompositeDesignTokensCollectionSubToken(token, 'delay', 'duration'),
    ),
    timingFunction: {
      $type: 'string',
      $value: 'linear', // TODO
    },
  };
}
