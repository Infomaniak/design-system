/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#transform-type
 */
export type FigmaTransform = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
];
