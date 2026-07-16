import type { FigmaColor } from './color/figma-color.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#colorstop-type
 */
export interface FigmaColorStop {
  readonly position: number;
  readonly color: FigmaColor;
  readonly boundVariables: Record<string, unknown /* TODO */>;
}
