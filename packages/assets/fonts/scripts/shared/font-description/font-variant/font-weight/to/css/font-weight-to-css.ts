import type { FontWeight } from '../../font-weight.ts';
import { fontWeightRangeToCss } from '../../range/to/css/font-weight-range-to-css.ts';
import { fontWeightStaticToCss } from '../../static/to/css/font-weight-static-to-css.ts';

export function fontWeightToCss(input: FontWeight): string {
  return typeof input === 'number' ? fontWeightStaticToCss(input) : fontWeightRangeToCss(input);
}
