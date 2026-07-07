import type { FigmaPath } from '../../types/path/figma-path.ts';

export interface HavingFigmaStrokeGeometry {
  readonly strokeGeometry: readonly FigmaPath[];
}

export interface HavingOptionalFigmaStrokeGeometry {
  readonly strokeGeometry?: readonly FigmaPath[]; // default: []
}
