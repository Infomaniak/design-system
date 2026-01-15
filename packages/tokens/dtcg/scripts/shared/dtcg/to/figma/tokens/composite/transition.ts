import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import type { TransitionDesignToken } from '../../../../design-token/token/types/composite/types/transition/transition-design-token.ts';
import type { TransitionDesignTokenValue } from '../../../../design-token/token/types/composite/types/transition/value/transition-design-token-value.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';
import { designTokenTreeToFigmaFormat } from '../../design-token-tree-to-figma-format.ts';

export function resolvedTransitionDesignTokenToFigmaObject(
  _token: TransitionDesignToken,
  { $value, ...properties }: ResolvedDesignToken<'transition', TransitionDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  const { duration, delay } = $value;

  console.warn('timingFunction skipped');

  return {
    duration: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'duration',
        $value: duration,
      },
      ctx,
    ),
    delay: designTokenTreeToFigmaFormat(
      {
        ...properties,
        $type: 'duration',
        $value: delay,
      },
      ctx,
    ),
  };
}
