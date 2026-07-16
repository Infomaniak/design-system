import type { FigmaStrokeJoin } from '../../figma-stroke-join.ts';

/**
 * @inheritDoch https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linejoin
 */
export type SvgStrokeLinejoin = 'arcs' | 'bevel' | 'miter' | 'miter-clip ' | 'round';

export function figmaStrokeJoinToSvgStrokeLinejoin(
  figmaStrokeJoin: FigmaStrokeJoin,
): SvgStrokeLinejoin {
  switch (figmaStrokeJoin) {
    case 'MITER':
      return 'miter';
    case 'BEVEL':
      return 'bevel';
    case 'ROUND':
      return 'round';
    default:
      throw new Error(`Unknown FigmaStrokeJoin: ${figmaStrokeJoin}`);
  }
}
