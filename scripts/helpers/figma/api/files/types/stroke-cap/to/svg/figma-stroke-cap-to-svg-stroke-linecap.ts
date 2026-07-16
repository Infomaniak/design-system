import type { FigmaStrokeCap } from '../../figma-stroke-cap.ts';

/**
 * @inheritDoch ttps://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linecap
 */
export type SvgStrokeLinecap = 'butt' | 'round' | 'square';

export function figmaStrokeCapToSvgStrokeLinecap(figmaStrokeCap: FigmaStrokeCap): SvgStrokeLinecap {
  switch (figmaStrokeCap) {
    case 'ROUND':
      return 'round';
    case 'SQUARE':
      return 'square';
    default:
      return 'butt';
  }
}
