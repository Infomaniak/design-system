import type { FigmaPaint } from '../../types/paint/figma-paint.ts';

export interface HavingFigmaFills {
  readonly fills: readonly FigmaPaint[];
}

export interface HavingOptionalFigmaFills {
  readonly fills?: readonly FigmaPaint[]; // default: []
}
