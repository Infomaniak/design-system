import type { UnknownDesignToken } from '../unknown/unknown-design-token.ts';
import type { ColorDesignToken } from './color-design-token.ts';

export function isColorDesignToken(input: UnknownDesignToken): input is ColorDesignToken {
  return input.$type === 'color';
}
