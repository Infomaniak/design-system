import type { GenericFigmaPaintBase } from '../../../../base/figma-paint-base.ts';
import type { FigmaGradiantPaintBase } from '../../base/figma-gradiant-paint-base.ts';

export type FigmaGradiantAngularPaint = FigmaGradiantPaintBase<'GRADIENT_ANGULAR'>;

export function isFigmaGradiantAngularPaint(
  input: GenericFigmaPaintBase,
): input is FigmaGradiantAngularPaint {
  return input.type === 'GRADIENT_ANGULAR';
}
