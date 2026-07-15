import type { GenericFigmaPaintBase } from '../../../../base/figma-paint-base.ts';
import type { FigmaImagePaintBase } from '../../base/figma-image-paint-base.ts';

export type FigmaVideoPaint = FigmaImagePaintBase<'VIDEO'>;

export function isFigmaVideoPaint(input: GenericFigmaPaintBase): input is FigmaVideoPaint {
  return input.type === 'VIDEO';
}
