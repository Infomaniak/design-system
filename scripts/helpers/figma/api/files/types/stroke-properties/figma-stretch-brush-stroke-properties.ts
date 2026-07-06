/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#stretchbrushstrokeproperties-type
 */
export interface FigmaStretchBrushStrokeProperties {
  readonly strokeType: 'BRUSH';
  readonly brushType: 'STRETCH';
  readonly brushNodeId: string;
  readonly brushName: string;
  readonly direction: 'FORWARD' | 'REVERSE';
}
