import type { FontWeightRange } from './range/font-weight-range.ts';
import type { FontWeightStatic } from './static/font-weight-static.ts';

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-weight
 */
export type FontWeight = FontWeightStatic | FontWeightRange;
