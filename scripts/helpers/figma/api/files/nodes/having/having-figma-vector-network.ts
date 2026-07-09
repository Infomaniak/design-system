import type { FigmaVectorNetwork } from '../../types/vector-network/figma-vector-network.ts';

export interface HavingFigmaVectorNetwork {
  readonly vectorNetwork: FigmaVectorNetwork;
}

export type HavingOptionalFigmaVectorNetwork = Partial<HavingFigmaVectorNetwork>;
