import type { FigmaScatterBrushStrokeProperties } from './figma-scatter-brush-stroke-properties.ts';
import type { FigmaStretchBrushStrokeProperties } from './figma-stretch-brush-stroke-properties.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#brushstrokeproperties-type
 */
export type FigmaBrushStrokeProperties =
  FigmaScatterBrushStrokeProperties | FigmaStretchBrushStrokeProperties;
