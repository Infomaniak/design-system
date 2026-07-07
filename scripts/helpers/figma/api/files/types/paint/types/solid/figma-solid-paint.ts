import type { FigmaColor } from '../../../color/figma-color.ts';
import type { FigmaPaintBase, GenericFigmaPaintBase } from '../../base/figma-paint-base.ts';

export interface FigmaSolidPaint extends FigmaPaintBase<'SOLID'> {
  readonly color: FigmaColor;
  readonly boundVariables?: Record<string, unknown /* TODO */>;
}

export function isFigmaSolidPaint(input: GenericFigmaPaintBase): input is FigmaSolidPaint {
  return input.type === 'SOLID';
}
