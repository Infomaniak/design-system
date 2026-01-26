import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { CubicBezierDesignToken } from './cubic-bezier-design-token.ts';

export function isCubicBezierDesignToken(
  input: GenericDesignToken,
): input is CubicBezierDesignToken {
  return input.$type === 'cubicBezier';
}
