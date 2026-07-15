import type { FigmaVector } from '../figma-vector.ts';

export interface FigmaVectorNetworkVertex {
  readonly position: FigmaVector;
  readonly meta: number;
}

export interface FigmaVectorNetworkSegment {
  readonly start: number;
  readonly startTangent: FigmaVector;
  readonly endTangent: FigmaVector;
  readonly end: number;
  readonly meta: number;
}

export interface FigmaVectorNetworkRegion {
  readonly loops: readonly (readonly number[])[];
  readonly windingRule: string;
  readonly meta: number;
}

export interface FigmaVectorNetwork {
  readonly vertices: readonly FigmaVectorNetworkVertex[];
  readonly segments: readonly FigmaVectorNetworkSegment[];
  readonly regions: readonly FigmaVectorNetworkRegion[] | null;
}
