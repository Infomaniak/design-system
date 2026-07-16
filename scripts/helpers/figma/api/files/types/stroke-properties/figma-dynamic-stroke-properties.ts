/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#dynamicstrokeproperties-type
 */
export interface FigmaDynamicStrokeProperties {
  readonly strokeType: 'DYNAMIC';
  readonly frequency: number;
  readonly wiggle: number;
  readonly smoothen: number;
}
