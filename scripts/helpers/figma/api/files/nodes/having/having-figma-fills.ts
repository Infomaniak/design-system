import type { FigmaPaint } from '../../types/paint/figma-paint.ts';

export interface HavingFigmaFills {
  readonly fills: readonly FigmaPaint[];
}

export type HavingOptionalFigmaFills = Partial<HavingFigmaFills>; // default: []
