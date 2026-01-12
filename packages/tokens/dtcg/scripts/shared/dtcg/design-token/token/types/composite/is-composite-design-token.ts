import type { GenericDesignToken } from '../../generic-design-token.js';
import type { CompositeDesignToken } from './composite-design-token.js';
import { isBorderDesignToken } from './types/border/is-border-design-token.js';
import { isGradientDesignToken } from './types/gradient/is-gradient-design-token.js';
import { isShadowDesignToken } from './types/shadow/is-shadow-design-token.js';
import { isStrokeStyleDesignToken } from './types/stroke-style/is-stroke-style-design-token.js';
import { isTransitionDesignToken } from './types/transition/is-transition-design-token.js';
import { isTypographyDesignToken } from './types/typography/is-typography-design-token.js';

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
