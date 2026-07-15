import type { GenericFigmaPaintBase } from '../../base/figma-paint-base.ts';
import type { FigmaSolidPaint } from '../solid/figma-solid-paint.ts';
import { type FigmaEmojiPaint, isFigmaEmojiPaint } from './types/emoji/figma-emoji-paint.ts';
import { type FigmaImagePaint, isFigmaImagePaint } from './types/image/figma-image-paint.ts';
import { type FigmaVideoPaint, isFigmaVideoPaint } from './types/video/figma-video-paint.ts';

export type FigmaImageLikePaint = FigmaImagePaint | FigmaEmojiPaint | FigmaVideoPaint;

export function isFigmaImageLikePaint(input: GenericFigmaPaintBase): input is FigmaSolidPaint {
  return isFigmaImagePaint(input) || isFigmaEmojiPaint(input) || isFigmaVideoPaint(input);
}
