import type { FigmaStrokeCap } from '../../types/stroke-cap/figma-stroke-cap.ts';

export interface HavingFigmaStrokeCap {
  readonly strokeCap: FigmaStrokeCap;
}

export type HavingOptionalFigmaStrokeCap = Partial<HavingFigmaStrokeCap>;
