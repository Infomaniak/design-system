import type { FigmaVariableWidthPoint } from '../../types/figma-variable-width-point.ts';

export interface HavingFigmaVariableWidthPoints {
  readonly variableWidthPoints: readonly FigmaVariableWidthPoint[];
}

export interface HavingOptionalFigmaVariableWidthPoints {
  readonly variableWidthPoints?: readonly FigmaVariableWidthPoint[]; // default: []
}
