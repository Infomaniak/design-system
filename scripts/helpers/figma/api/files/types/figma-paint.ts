/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#paint-type
 */
export interface FigmaPaint {
  readonly type:
    | 'SOLID'
    | 'GRADIENT_LINEAR'
    | 'GRADIENT_RADIAL'
    | 'GRADIENT_ANGULAR'
    | 'GRADIENT_DIAMOND'
    | 'IMAGE'
    | 'EMOJI'
    | 'VIDEO'
    | 'PATTERN';
  /* TODO: others */
}
