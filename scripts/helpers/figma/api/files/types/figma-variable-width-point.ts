/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#variablewidthpoint-type
 */
export interface FigmaVariableWidthPoint {
  readonly segment: number;
  readonly position: number;
  readonly width: number;
}
