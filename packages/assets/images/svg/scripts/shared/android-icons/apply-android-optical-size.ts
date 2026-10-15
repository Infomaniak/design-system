import type { SVG } from '@iconify/tools';
import {
  applyOpticalSizes,
  DEFAULT_OPTICAL_SIZE_OPTIONS,
} from '../svg/iconify/build-svg-set-from-svg-directory/apply-optical-sizes.ts';
import { ANDROID_ICON_VIEW_BOX_SIZE } from './android-icons-config.ts';

/** Same equation as the web optical sizing (`calc((1em / 32) + 1px)`): `(size / 32) + 1`. */
const OPTICAL_STROKE_WIDTH_SIZE_DIVISOR = 32;
const OPTICAL_STROKE_WIDTH_OFFSET = 1;
const OPTICAL_STROKE_WIDTH_DECIMALS = 4;

/**
 * Computes the stroke width, expressed in `viewBox` units, rendering the web optical stroke width
 * at the given icon size (Compose has no `calc()` nor `non-scaling-stroke`).
 */
export function computeAndroidOpticalStrokeWidth(iconSize: number): number {
  const renderedStrokeWidth: number =
    iconSize / OPTICAL_STROKE_WIDTH_SIZE_DIVISOR + OPTICAL_STROKE_WIDTH_OFFSET;

  return Number(
    ((renderedStrokeWidth * ANDROID_ICON_VIEW_BOX_SIZE) / iconSize).toFixed(
      OPTICAL_STROKE_WIDTH_DECIMALS,
    ),
  );
}

/** Applies the web optical sizing to the SVG, with the stroke width of the given icon size. */
export function applyAndroidOpticalSize(svg: SVG, iconSize: number): void {
  applyOpticalSizes(svg, {
    ...DEFAULT_OPTICAL_SIZE_OPTIONS,
    equation: String(computeAndroidOpticalStrokeWidth(iconSize)),
  });
}
