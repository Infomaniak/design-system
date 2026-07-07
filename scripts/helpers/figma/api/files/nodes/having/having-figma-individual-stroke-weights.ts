import type { FigmaStrokeWeight } from '../../types/figma-stroke-weight.ts';

export interface HavingFigmaIndividualStrokeWeights {
  readonly individualStrokeWeights: FigmaStrokeWeight;
}

export interface HavingOptionalFigmaIndividualStrokeWeights {
  readonly individualStrokeWeights?: FigmaStrokeWeight; // default: undefined
}
