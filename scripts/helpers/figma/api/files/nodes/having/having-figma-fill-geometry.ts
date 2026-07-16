import type { FigmaPath } from '../../types/path/figma-path.ts';

export interface HavingFigmaFillGeometry {
  readonly fillGeometry: readonly FigmaPath[];
}

export type HavingOptionalFigmaFillGeometry = Partial<HavingFigmaFillGeometry>; // default: []
