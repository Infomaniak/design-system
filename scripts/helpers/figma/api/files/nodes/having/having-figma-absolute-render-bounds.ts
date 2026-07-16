import type { FigmaRectangle } from '../../types/figma-rectangle.ts';

export interface HavingFigmaAbsoluteRenderBounds {
  readonly absoluteRenderBounds: FigmaRectangle | null;
}
