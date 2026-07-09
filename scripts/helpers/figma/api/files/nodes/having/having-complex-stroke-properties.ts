import type { FigmaComplexStrokeProperties } from '../../types/stroke-properties/figma-complex-stroke-properties.ts';

export interface HavingComplexStrokeProperties {
  readonly complexStrokeProperties: FigmaComplexStrokeProperties;
}

export type HavingOptionalComplexStrokeProperties = Partial<HavingComplexStrokeProperties>; // default: {}
