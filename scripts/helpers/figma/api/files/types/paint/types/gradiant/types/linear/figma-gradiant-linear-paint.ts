import type { GenericFigmaPaintBase } from '../../../../base/figma-paint-base.ts';
import type { FigmaGradiantPaintBase } from '../../base/figma-gradiant-paint-base.ts';

export type FigmaGradiantLinearPaint = FigmaGradiantPaintBase<'GRADIENT_LINEAR'>;

export function isFigmaGradiantLinearPaint(
  input: GenericFigmaPaintBase,
): input is FigmaGradiantLinearPaint {
  return input.type === 'GRADIENT_LINEAR';
}
