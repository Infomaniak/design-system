import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { StrokeStyleDesignToken } from './stroke-style-design-token.ts';

export function isStrokeStyleDesignToken(
  input: GenericDesignToken,
): input is StrokeStyleDesignToken {
  return input.$type === 'strokeStyle';
}
