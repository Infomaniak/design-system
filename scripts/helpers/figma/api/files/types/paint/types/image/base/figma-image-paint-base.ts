import type { FigmaTransform } from '../../../../transform/figma-transform.ts';
import type { FigmaPaintBase } from '../../../base/figma-paint-base.ts';

export type FigmaImagePaintType = 'IMAGE' | 'EMOJI' | 'VIDEO';

export interface FigmaImagePaintBase<
  GType extends FigmaImagePaintType,
> extends FigmaPaintBase<GType> {
  readonly scaleMode: 'FILL' | 'FIT' | 'TILE' | 'STRETCH';
  readonly imageTransform: FigmaTransform;
  readonly scalingFactor: number;
  readonly rotation: number;
  readonly imageRef: string;
  readonly filters: unknown /* TODO */;
  readonly gifRef: string;
}

export type GenericFigmaImagePaintBase = FigmaImagePaintBase<FigmaImagePaintType>;
