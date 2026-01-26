import type { GenericDesignToken } from '../../generic-design-token.ts';
import type { CompositeDesignToken } from './composite-design-token.ts';
import { isBorderDesignToken } from './types/border/is-border-design-token.ts';
import { isGradientDesignToken } from './types/gradient/is-gradient-design-token.ts';
import { isShadowDesignToken } from './types/shadow/is-shadow-design-token.ts';
import { isStrokeStyleDesignToken } from './types/stroke-style/is-stroke-style-design-token.ts';
import { isTransitionDesignToken } from './types/transition/is-transition-design-token.ts';
import { isTypographyDesignToken } from './types/typography/is-typography-design-token.ts';

export function isCompositeDesignToken(input: GenericDesignToken): input is CompositeDesignToken {
  return (
    isBorderDesignToken(input) ||
    isGradientDesignToken(input) ||
    isShadowDesignToken(input) ||
    isStrokeStyleDesignToken(input) ||
    isTransitionDesignToken(input) ||
    isTypographyDesignToken(input)
  );
}
