import { areFloatEqual } from '../../../../../../../misc/number/are-float-equal.ts';
import type { FigmaTransform } from '../../figma-transform.ts';

/**
 * @inheritDoch https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform
 * @inheritDoch https://drafts.csswg.org/css-transforms/#svg-transform
 */
export function figmaTransformToSvgTransform([
  [m00, m01, m02],
  [m10, m11, m12],
]: FigmaTransform): string {
  if (
    areFloatEqual(m00, 1) &&
    areFloatEqual(m01, 0) &&
    areFloatEqual(m10, 0) &&
    areFloatEqual(m11, 1)
  ) {
    if (areFloatEqual(m02, 0) && areFloatEqual(m12, 0)) {
      return 'none';
    }
    return `translate(${String(m02)} ${String(m12)})`;
  }

  return `matrix(${String(m00)} ${String(m10)} ${String(m01)} ${String(m11)} ${String(m02)} ${String(m12)})`;
}
