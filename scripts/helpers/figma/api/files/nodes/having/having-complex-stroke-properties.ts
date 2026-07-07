import type { FigmaComplexStrokeProperties } from '../../types/stroke-properties/figma-complex-stroke-properties.ts';

export interface HavingComplexStrokeProperties {
  readonly complexStrokeProperties: FigmaComplexStrokeProperties; // default: {}
}

export interface HavingOptionalComplexStrokeProperties {
  readonly complexStrokeProperties?: FigmaComplexStrokeProperties; // default: {}
}
