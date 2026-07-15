/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#layoutconstraint-type
 */
export interface FigmaLayoutConstraint {
  readonly vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
  readonly horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
}
