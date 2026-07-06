import type { FigmaBasicStrokeProperties } from './figma-basic-stroke-properties.ts';
import type { FigmaBrushStrokeProperties } from './figma-brush-stroke-properties.ts';
import type { FigmaDynamicStrokeProperties } from './figma-dynamic-stroke-properties.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#complexstrokeproperties-type
 */
export type FigmaComplexStrokeProperties =
  FigmaBasicStrokeProperties | FigmaBrushStrokeProperties | FigmaDynamicStrokeProperties;
