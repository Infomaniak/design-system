import type { FontWeightRange } from './range/font-weight-range.ts';
import type { FontWeightStatic } from './static/font-weight-static.ts';

export type FontWeight = FontWeightStatic | FontWeightRange;
