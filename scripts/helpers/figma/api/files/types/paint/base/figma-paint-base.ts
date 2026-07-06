import type { FigmaBlendMode } from '../../figma-blend-mode.ts';

export type FigmaPaintType =
  | 'SOLID'
  | 'GRADIENT_LINEAR'
  | 'GRADIENT_RADIAL'
  | 'GRADIENT_ANGULAR'
  | 'GRADIENT_DIAMOND'
  | 'IMAGE'
  | 'EMOJI'
  | 'VIDEO'
  | 'PATTERN';

export interface FigmaPaintBase<GType extends FigmaPaintType> {
  readonly type: GType;
  readonly visible: boolean;
  readonly opacity: boolean;
  readonly blendMode: FigmaBlendMode;
}

export type GenericFigmaPaintBase = FigmaPaintBase<FigmaPaintType>;
