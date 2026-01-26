import type { BorderDesignToken } from './types/border/border-design-token.ts';
import type { GradientDesignToken } from './types/gradient/gradient-design-token.ts';
import type { ShadowDesignToken } from './types/shadow/shadow-design-token.ts';
import type { StrokeStyleDesignToken } from './types/stroke-style/stroke-style-design-token.ts';
import type { TransitionDesignToken } from './types/transition/transition-design-token.ts';
import type { TypographyDesignToken } from './types/typography/typography-design-token.ts';

export type CompositeDesignToken =
  | BorderDesignToken
  | GradientDesignToken
  | ShadowDesignToken
  | StrokeStyleDesignToken
  | TransitionDesignToken
  | TypographyDesignToken;
