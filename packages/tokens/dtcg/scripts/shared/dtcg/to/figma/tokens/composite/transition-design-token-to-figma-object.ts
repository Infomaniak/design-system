import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToSegmentsReference } from '../../../../design-token/reference/to/segments-reference/design-token-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../../../../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { TransitionDesignToken } from '../../../../design-token/token/types/composite/types/transition/transition-design-token.ts';
import { durationDesignTokenToFigmaObject } from '../base/duration-design-token-to-figma-object.ts';

export function transitionDesignTokenToFigmaObject({ $value }: TransitionDesignToken): any {
  if (isDesignTokenReference($value)) {
    const reference: SegmentsReference = designTokenReferenceToSegmentsReference($value);

    return {
      duration: {
        $value: segmentsReferenceToCurlyReference([...reference, 'duration']),
      },
      delay: {
        $value: segmentsReferenceToCurlyReference([...reference, 'delay']),
      },
      // timingFunction: {
      //   $value: segmentsReferenceToCurlyReference([...reference, 'timingFunction']),
      // },
    };
  }

  const { duration, delay } = $value;

  console.warn('timingFunction skipped');

  return {
    duration: durationDesignTokenToFigmaObject({
      $value: duration,
    }),
    delay: durationDesignTokenToFigmaObject({
      $value: delay,
    }),
    // timingFunction: cubicBezierDesignTokenToFigmaObject({
    //   $value: timingFunction,
    // }),
  };
}
