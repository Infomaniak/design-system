import type { FigmaSize } from './figma-size.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-property-types/#prototypedevice-type
 */
export interface FigmaPrototypeDevice {
  readonly type: 'NONE' | 'PRESET' | 'CUSTOM' | 'PRESENTATION';
  readonly size: FigmaSize;
  readonly presetIdentifier: string;
  readonly rotation: 'NONE' | 'CCW_90';
}
