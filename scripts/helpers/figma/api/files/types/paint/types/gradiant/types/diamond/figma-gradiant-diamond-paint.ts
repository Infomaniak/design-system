import type { GenericFigmaPaintBase } from '../../../../base/figma-paint-base.ts';
import type { FigmaGradiantPaintBase } from '../../base/figma-gradiant-paint-base.ts';

export type FigmaGradiantDiamondPaint = FigmaGradiantPaintBase<'GRADIENT_DIAMOND'>;

export function isFigmaGradiantDiamondPaint(
  input: GenericFigmaPaintBase,
): input is FigmaGradiantDiamondPaint {
  return input.type === 'GRADIENT_DIAMOND';
}
