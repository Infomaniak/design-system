import type { FigmaStrokeJoin } from '../../types/stroke-join/figma-stroke-join.ts';

export interface HavingFigmaStrokeJoin {
  readonly strokeJoin: FigmaStrokeJoin;
}

export interface HavingOptionalFigmaStrokeJoin {
  readonly strokeJoin?: FigmaStrokeJoin;
}
