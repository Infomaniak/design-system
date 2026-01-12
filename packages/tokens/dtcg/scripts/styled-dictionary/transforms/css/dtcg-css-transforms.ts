import { DTCG_COLOR_CSS } from './tokens/base/color.ts';
import { DTCG_CUBIC_BEZIER_CSS } from './tokens/base/cubic-bezier.ts';
import { DTCG_DIMENSION_CSS } from './tokens/base/dimension.ts';
import { DTCG_DURATION_CSS } from './tokens/base/duration.ts';
import { DTCG_FONT_FAMILY_CSS } from './tokens/base/font-family.ts';
import { DTCG_FONT_WEIGHT_CSS } from './tokens/base/font-weight.ts';
import { DTCG_NUMBER_CSS } from './tokens/base/number.ts';
import { DTCG_BORDER_CSS } from './tokens/composite/border.ts';
import { DTCG_STROKE_STYLE_CSS } from './tokens/composite/stroke-style.ts';
import { DTCG_TRANSITION_CSS } from './tokens/composite/transition.ts';
import { DTCG_TYPOGRAPHY_CSS } from './tokens/composite/typography.ts';

export const DTCG_CSS_TRANSFORMS = [
  'name/kebab',
  DTCG_COLOR_CSS,
  DTCG_DIMENSION_CSS,
  DTCG_FONT_FAMILY_CSS,
  DTCG_FONT_WEIGHT_CSS,
  DTCG_DURATION_CSS,
  DTCG_CUBIC_BEZIER_CSS,
  DTCG_NUMBER_CSS,
  // composite
  DTCG_BORDER_CSS,
  DTCG_TRANSITION_CSS,
  DTCG_STROKE_STYLE_CSS,
  DTCG_TYPOGRAPHY_CSS,
];
