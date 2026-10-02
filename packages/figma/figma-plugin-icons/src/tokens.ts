export type IconSize = 16 | 20 | 24 | 32 | 40;

export interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export const ICON_SIZES = [16, 20, 24, 32, 40] as const;

/** Reference size of the source icon in Figma. */
export const CANVAS_SIZE = 24;

/** Sizing tolerance (in px) when comparing node dimensions to the canvas size. */
export const SIZE_TOLERANCE = 0.1;

/** A node matches the canvas size when both dimensions are within tolerance of 24px. */
export function isCanvasSize(node: { readonly width: number; readonly height: number }): boolean {
  return (
    Math.abs(node.width - CANVAS_SIZE) < SIZE_TOLERANCE &&
    Math.abs(node.height - CANVAS_SIZE) < SIZE_TOLERANCE
  );
}

export type StrokeConfig = Record<IconSize, number>;

export const DEFAULT_STROKE_WEIGHTS: StrokeConfig = {
  16: 1.25,
  20: 1.5,
  24: 1.75,
  32: 2,
  40: 2.25,
};

export const ICON_COLORS = {
  default: { r: 0, g: 0, b: 0 },
  disabled: { r: 0.5, g: 0.5, b: 0.5 },
} as const;

export function isIconSize(value: unknown): value is IconSize {
  return typeof value === 'number' && (ICON_SIZES as readonly number[]).includes(value);
}
