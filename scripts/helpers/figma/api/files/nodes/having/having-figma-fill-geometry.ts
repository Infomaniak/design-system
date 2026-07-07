import type { FigmaPath } from '../../types/path/figma-path.ts';

export interface HavingFigmaFillGeometry {
  readonly fillGeometry: readonly FigmaPath[];
}

export interface HavingOptionalFigmaFillGeometry {
  readonly fillGeometry?: readonly FigmaPath[]; // default: []
}
