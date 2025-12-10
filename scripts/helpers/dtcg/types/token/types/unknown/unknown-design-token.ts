import type { ColorDesignToken } from '../color/color-design-token.ts';
import type { BorderDesignToken } from '../composite/border/border-design-token.ts';
import type { GradientDesignToken } from '../composite/gradient/gradient-design-token.ts';
import type { ShadowDesignToken } from '../composite/shadow/shadow-design-token.ts';
import type { StrokeStyleDesignToken } from '../composite/stroke-style/stroke-style-design-token.ts';
import type { TransitionDesignToken } from '../composite/transition/transition-design-token.ts';
import type { TypographyDesignToken } from '../composite/typography/typography-design-token.ts';
import type { CubicBezierDesignToken } from '../cubic-bezier/cubic-bezier-design-token.ts';
import type { DimensionDesignToken } from '../dimension/dimension-design-token.ts';
import type { DurationDesignToken } from '../duration/duration-design-token.ts';
import type { FontFamilyDesignToken } from '../font-family/font-family-design-token.ts';
import type { FontWeightDesignToken } from '../font-weight/font-weight-design-token.ts';
import type { NumberDesignToken } from '../number/number-design-token.ts';

export type UnknownDesignToken =
  | ColorDesignToken
  | DimensionDesignToken
  | FontFamilyDesignToken
  | FontWeightDesignToken
  | DurationDesignToken
  | CubicBezierDesignToken
  | NumberDesignToken
  | StrokeStyleDesignToken
  | BorderDesignToken
  | TransitionDesignToken
  | ShadowDesignToken
  | GradientDesignToken
  | TypographyDesignToken;
