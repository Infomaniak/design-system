import type { ColorDesignToken } from './types/color/color-design-token.js';
import type { CubicBezierDesignToken } from './types/cubic-bezier/cubic-bezier-design-token.js';
import type { DimensionDesignToken } from './types/dimension/dimension-design-token.js';
import type { DurationDesignToken } from './types/duration/duration-design-token.js';
import type { FontFamilyDesignToken } from './types/font-family/font-family-design-token.js';
import type { FontWeightDesignToken } from './types/font-weight/font-weight-design-token.js';
import type { NumberDesignToken } from './types/number/number-design-token.js';

export type BaseDesignToken =
  | ColorDesignToken
  | CubicBezierDesignToken
  | DimensionDesignToken
  | DurationDesignToken
  | FontFamilyDesignToken
  | FontWeightDesignToken
  | NumberDesignToken;
