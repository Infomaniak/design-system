import type Color from 'colorjs.io';
import { XCASSETS_INFO } from './constants/xcassets-info.ts';

export interface XCAssetsColorComponent {
  readonly alpha: number;
  readonly blue: number;
  readonly green: number;
  readonly red: number;
}

export interface XCAssetsColor {
  readonly color: {
    readonly 'color-space': string;
    readonly components: XCAssetsColorComponent;
  };
  readonly idiom: 'universal';
}

export interface XCAssetsColorSet {
  readonly colors: XCAssetsColor[];
  readonly info: XCAssetsInfo;
}

export interface XCAssetsInfo {
  readonly author: string;
  readonly version: number;
}

export function buildColorsetContents(sRGBColor: Color): XCAssetsColorSet {
  if (sRGBColor.space.name !== 'sRGB') {
    throw new Error('Expected sRGB color');
  }

  return {
    colors: [
      {
        color: {
          'color-space': 'srgb',
          components: {
            red: sRGBColor.coords[0] ?? 0,
            green: sRGBColor.coords[1] ?? 0,
            blue: sRGBColor.coords[2] ?? 0,
            alpha: sRGBColor.alpha,
          },
        },
        idiom: 'universal',
      },
    ],
    info: XCASSETS_INFO,
  };
}
