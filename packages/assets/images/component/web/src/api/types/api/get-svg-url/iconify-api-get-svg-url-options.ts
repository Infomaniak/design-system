export interface IconifyApiGetSVGUrlOptions {
  readonly prefix: string;
  readonly name: string;
  readonly color?: string;
  readonly width?: string | number;
  readonly height?: string | number;
  readonly flip?: string;
  readonly rotate?: string | number;
  readonly download?: boolean;
  readonly box?: boolean;
  readonly resourceIndex?: number;
}
