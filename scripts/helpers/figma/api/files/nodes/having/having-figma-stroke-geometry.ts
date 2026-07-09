import type { FigmaPath } from '../../types/path/figma-path.ts';

export interface HavingFigmaStrokeGeometry {
  readonly strokeGeometry: readonly FigmaPath[];
}

export type HavingOptionalFigmaStrokeGeometry = Partial<HavingFigmaStrokeGeometry>; // default: []
