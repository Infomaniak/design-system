import type { ValueOrCurlyReference } from '../../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { CubicBezierDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/cubic-bezier/value/cubic-bezier-design-tokens-collection-token-value.ts';
import type { DurationDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/duration/value/duration-design-tokens-collection-token-value.ts';
import type { TransitionDesignTokensCollectionToken } from '../../../../../../token/types/composite/transition/transition-design-tokens-collection-token.ts';
import type { FigmaDesignTokensGroup } from '../../../../figma/group/figma-design-tokens-group.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import type { StringFigmaDesignToken } from '../../../../figma/token/types/string/string-figma-design-token.ts';
import { compositeDesignTokensCollectionTokenToFigmaDesignToken } from '../../composite-design-tokens-collection-token-to-figma-design-token.ts';
import { durationDesignTokensCollectionTokenToNumberFigmaDesignToken } from '../base/duration.ts';

export function transitionDesignTokensCollectionTokenToFigmaDesignTokensGroup(
  token: TransitionDesignTokensCollectionToken,
): FigmaDesignTokensGroup {
  console.warn('timingFunction skipped');

  return compositeDesignTokensCollectionTokenToFigmaDesignToken(token, {
    duration: (
      value: ValueOrCurlyReference<DurationDesignTokensCollectionTokenValue>,
    ): NumberFigmaDesignToken =>
      durationDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'duration',
        value,
      }),
    delay: (
      value: ValueOrCurlyReference<DurationDesignTokensCollectionTokenValue>,
    ): NumberFigmaDesignToken =>
      durationDesignTokensCollectionTokenToNumberFigmaDesignToken({
        ...token,
        type: 'duration',
        value,
      }),
    timingFunction: (
      _value: ValueOrCurlyReference<CubicBezierDesignTokensCollectionTokenValue>,
    ): StringFigmaDesignToken => {
      console.warn('Timing function is not supported yet by Figma.');
      return {
        $type: 'string',
        $value: 'linear',
      };
    },
  });
}
