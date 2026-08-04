import { fontWeightStaticToCss } from '../../../static/to/css/font-weight-static-to-css.ts';
import type { FontWeightRange } from '../../font-weight-range.ts';

export function fontWeightRangeToCss([start, end]: FontWeightRange): string {
  return `${fontWeightStaticToCss(start)} ${fontWeightStaticToCss(end)}`;
}
