import type { GenericFigmaPaintBase } from '../../../../base/figma-paint-base.ts';
import type { FigmaImagePaintBase } from '../../base/figma-image-paint-base.ts';

export type FigmaImagePaint = FigmaImagePaintBase<'IMAGE'>;

export function isFigmaImagePaint(input: GenericFigmaPaintBase): input is FigmaImagePaint {
  return input.type === 'IMAGE';
}
