import type { FigmaStrokeCap } from '../../types/stroke-cap/figma-stroke-cap.ts';

export interface HavingFigmaStrokeCap {
  readonly strokeCap: FigmaStrokeCap;
}

export interface HavingOptionalFigmaStrokeCap {
  readonly strokeCap?: FigmaStrokeCap;
}
