import type { ColorDesignToken } from './types/color/color-design-token.ts';
import type { CubicBezierDesignToken } from './types/cubic-bezier/cubic-bezier-design-token.ts';
import type { DimensionDesignToken } from './types/dimension/dimension-design-token.ts';
import type { DurationDesignToken } from './types/duration/duration-design-token.ts';
import type { FontFamilyDesignToken } from './types/font-family/font-family-design-token.ts';
import type { FontWeightDesignToken } from './types/font-weight/font-weight-design-token.ts';
import type { NumberDesignToken } from './types/number/number-design-token.ts';

export type BaseDesignToken =
  | ColorDesignToken
  | CubicBezierDesignToken
  | DimensionDesignToken
  | DurationDesignToken
  | FontFamilyDesignToken
  | FontWeightDesignToken
  | NumberDesignToken;
