import type { FigmaColorStop } from '../../../../figma-color-stop.ts';
import type { FigmaVector } from '../../../../figma-vector.ts';
import type { FigmaPaintBase } from '../../../base/figma-paint-base.ts';

export type FigmaGradiantPaintType =
  'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND';

export interface FigmaGradiantPaintBase<
  GType extends FigmaGradiantPaintType,
> extends FigmaPaintBase<GType> {
  readonly gradientHandlePositions: readonly FigmaVector[];
  readonly gradientStops: readonly FigmaColorStop[];
}

export type GenericFigmaGradiantPaintBase = FigmaGradiantPaintBase<FigmaGradiantPaintType>;
