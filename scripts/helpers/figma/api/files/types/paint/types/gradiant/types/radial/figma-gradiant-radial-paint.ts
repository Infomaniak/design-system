import type { GenericFigmaPaintBase } from '../../../../base/figma-paint-base.ts';
import type { FigmaGradiantPaintBase } from '../../base/figma-gradiant-paint-base.ts';

export type FigmaGradiantRadialPaint = FigmaGradiantPaintBase<'GRADIENT_RADIAL'>;

export function isFigmaGradiantRadialPaint(
  input: GenericFigmaPaintBase,
): input is FigmaGradiantRadialPaint {
  return input.type === 'GRADIENT_RADIAL';
}
