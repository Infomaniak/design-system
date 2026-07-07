import type { FigmaPaint } from '../../types/paint/figma-paint.ts';

export interface HavingFigmaStrokes {
  readonly strokes: readonly FigmaPaint[]; // default: []
}

export interface HavingOptionalFigmaStrokes {
  readonly strokes?: readonly FigmaPaint[]; // default: []
}
