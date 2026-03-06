export interface XCAssetsInfo {
  readonly author: string;
  readonly version: number;
}

export interface XCAssetsColorComponent {
  readonly alpha: string;
  readonly blue: string;
  readonly green: string;
  readonly red: string;
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

export const defaultXCAssets: XCAssetsInfo = {
  author: 'esds',
  version: 1,
};
