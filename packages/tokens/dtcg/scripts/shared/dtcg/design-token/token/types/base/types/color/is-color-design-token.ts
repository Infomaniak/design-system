import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { ColorDesignToken } from './color-design-token.ts';

export function isColorDesignToken(input: GenericDesignToken): input is ColorDesignToken {
  return input.$type === 'color';
}
