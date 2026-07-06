import type { FigmaTransform } from '../../figma-transform.ts';

/**
 * @inheritDoch https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform
 * @inheritDoch https://drafts.csswg.org/css-transforms/#svg-transform
 */
export function figmaTransformToSvgTransform([
  [m00, m01, m02],
  [m10, m11, m12],
]: FigmaTransform): string {
  const EPS = 1e-10;

  // TODO support `none`

  if (
    Math.abs(m00 - 1) < EPS &&
    Math.abs(m01) < EPS &&
    Math.abs(m10) < EPS &&
    Math.abs(m11 - 1) < EPS
  ) {
    return `translate(${String(m02)} ${String(m12)})`;
  }

  return `matrix(${String(m00)} ${String(m10)} ${String(m01)} ${String(m11)} ${String(m02)} ${String(m12)})`;
}
