/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#path-type
 */
export interface FigmaPath {
  readonly path: string;
  readonly windingRule: string;
  readonly overrideID: number;
}
