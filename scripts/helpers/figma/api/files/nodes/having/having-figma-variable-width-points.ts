import type { FigmaVariableWidthPoint } from '../../types/figma-variable-width-point.ts';

export interface HavingFigmaVariableWidthPoints {
  readonly variableWidthPoints: readonly FigmaVariableWidthPoint[];
}

export type HavingOptionalFigmaVariableWidthPoints = Partial<HavingFigmaVariableWidthPoints>; // default: []
