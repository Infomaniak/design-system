import type { FigmaStrokeWeight } from '../../types/figma-stroke-weight.ts';

export interface HavingFigmaIndividualStrokeWeights {
  readonly individualStrokeWeights: FigmaStrokeWeight;
}

export type HavingOptionalFigmaIndividualStrokeWeights = Partial<HavingFigmaIndividualStrokeWeights>; // default: undefined
