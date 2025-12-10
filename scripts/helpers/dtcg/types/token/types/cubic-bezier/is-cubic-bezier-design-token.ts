import type { UnknownDesignToken } from '../unknown/unknown-design-token.ts';
import type { CubicBezierDesignToken } from './cubic-bezier-design-token.ts';

export function isCubicBezierDesignToken(
  input: UnknownDesignToken,
): input is CubicBezierDesignToken {
  return input.$type === 'cubicBezier';
}
