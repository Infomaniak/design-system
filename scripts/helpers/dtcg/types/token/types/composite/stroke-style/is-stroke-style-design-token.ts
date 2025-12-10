import type { UnknownDesignToken } from '../../unknown/unknown-design-token.ts';
import type { StrokeStyleDesignToken } from './stroke-style-design-token.ts';

export function isStrokeStyleDesignToken(
  input: UnknownDesignToken,
): input is StrokeStyleDesignToken {
  return input.$type === 'strokeStyle';
}
