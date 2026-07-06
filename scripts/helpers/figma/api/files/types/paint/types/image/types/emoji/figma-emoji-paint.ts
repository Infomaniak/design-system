import type { GenericFigmaPaintBase } from '../../../../base/figma-paint-base.ts';
import type { FigmaImagePaintBase } from '../../base/figma-image-paint-base.ts';

export type FigmaEmojiPaint = FigmaImagePaintBase<'EMOJI'>;

export function isFigmaEmojiPaint(input: GenericFigmaPaintBase): input is FigmaEmojiPaint {
  return input.type === 'EMOJI';
}
